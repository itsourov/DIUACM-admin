<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\RankList;
use App\Models\SolveStat;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use DateTime;
use DateTimeZone;
use Exception;

class UpdateVjudgeContest extends Command
{
    protected $signature = 'app:update-vjudge-contest
                          {--cookie= : Vjudge cookie for authentication}
                          {--no-interactive : Run without interactive prompts}';

    protected $description = 'Update solve statistics for Vjudge contests';

    private const VJUDGE_API = [
        'BASE_URL' => 'https://vjudge.net',
        'ENDPOINTS' => [
            'USER_UPDATE' => '/user/update',
            'CONTEST_RANK' => '/contest/rank/single'
        ]
    ];

    private const CACHE_KEY = 'vjudge_cookie';
    private const CACHE_TTL = 86400;

    private int $totalProcessed = 0;
    private int $totalEvents = 0;
    private int $successfulUpdates = 0;
    private int $failedUpdates = 0;
    private ?string $cookie = null;
    private ?string $authenticatedUsername = null;
    private DateTime $startTime;
    private string $currentUser;

    public function __construct()
    {
        parent::__construct();
        $this->startTime = new DateTime('2025-02-20 09:47:36', new DateTimeZone('UTC'));
        $this->currentUser = 'itsourov';
    }

    public function handle(): void
    {
        $this->newLine();
        $this->components->info('🚀 Starting Vjudge Contest Update Process');
        $this->components->info("Started by {$this->currentUser} at {$this->startTime->format('Y-m-d H:i:s')} UTC");
        $this->newLine();

        if (!$this->handleAuthentication()) {
            return;
        }

        $this->components->task('Loading ranklists and events', function() {
            $rankLists = RankList::where('is_archived', false)
                ->with([
                    'events' => function ($query) {
                        $query->whereRaw('event_link LIKE ?', ['%vjudge.net%']);
                    },
                    'events.rankLists.users' => function ($query) {
                        $query->whereNotNull('vjudge_handle')
                            ->select('users.id', 'users.vjudge_handle');
                    }
                ])
                ->get();

            $events = $rankLists->pluck('events')->flatten()->unique('id');
            $this->totalEvents = $events->count();

            if ($this->totalEvents === 0) {
                $this->components->warn('No Vjudge contests found to process');
                return false;
            }

            $this->line("Found {$this->totalEvents} Vjudge contests to process");
            $this->newLine();

            foreach ($events as $event) {
                $this->processEvent($event);
            }

            return true;
        });

        $this->displaySummary();
    }

    private function handleAuthentication(): bool
    {
        $noInteractive = $this->option('no-interactive');
        $this->cookie = $this->option('cookie');

        // If running non-interactively, use provided cookie or proceed without auth
        if ($noInteractive) {
            if ($this->cookie) {
                $validationResult = $this->validateCookie($this->cookie);
                if ($validationResult['success']) {
                    $this->authenticatedUsername = $validationResult['username'];
                    $this->components->info("✓ Authenticated as: {$this->authenticatedUsername}");
                } else {
                    $this->components->warn("Invalid cookie provided, proceeding without authentication");
                    $this->cookie = null;
                }
            }
            return true;
        }

        // Try to get cached cookie if none provided
        if (!$this->cookie) {
            $this->cookie = Cache::get(self::CACHE_KEY);
        }

        // Validate existing cookie if available
        if ($this->cookie) {
            $validationResult = $this->validateCookie($this->cookie);
            if ($validationResult['success']) {
                $this->authenticatedUsername = $validationResult['username'];
                if (!$this->confirm("Currently authenticated as {$this->authenticatedUsername}. Continue with this session?")) {
                    $this->cookie = null;
                    Cache::forget(self::CACHE_KEY);
                }
            } else {
                $this->components->warn("Cached cookie is invalid");
                $this->cookie = null;
                Cache::forget(self::CACHE_KEY);
            }
        }

        // If no valid cookie, ask for new one
        if (!$this->cookie) {
            if ($this->confirm('Would you like to authenticate with Vjudge?', true)) {
                $attempts = 0;
                $maxAttempts = 3;

                while ($attempts < $maxAttempts) {
                    $this->cookie = $this->askWithoutQuotes('Please enter your Vjudge cookie (entire cookie string):');
                    $validationResult = $this->validateCookie($this->cookie);

                    if ($validationResult['success']) {
                        $this->authenticatedUsername = $validationResult['username'];
                        $this->components->info("✓ Successfully authenticated as: {$this->authenticatedUsername}");

                        // Cache the successful cookie
                        if ($this->confirm('Would you like to remember this cookie for 24 hours?', true)) {
                            Cache::put(self::CACHE_KEY, $this->cookie, self::CACHE_TTL);
                            $this->components->info('Cookie cached successfully');
                        }

                        break;
                    }

                    $attempts++;
                    if ($attempts < $maxAttempts) {
                        $this->components->error("Invalid cookie. Please try again ({$attempts}/{$maxAttempts})");
                    } else {
                        $this->components->error("Maximum authentication attempts reached");
                        if (!$this->confirm('Would you like to continue without authentication?', true)) {
                            return false;
                        }
                        $this->cookie = null;
                    }
                }
            } else {
                $this->components->warn("Proceeding without authentication (some contests may not be accessible)");
                $this->cookie = null;
            }
        }

        return true;
    }

    private function validateCookie(string $cookie): array
    {
        try {
            $response = Http::withHeaders([
                'accept' => '*/*',
                'cookie' => $cookie,
                'x-requested-with' => 'XMLHttpRequest'
            ])->get(self::VJUDGE_API['BASE_URL'] . self::VJUDGE_API['ENDPOINTS']['USER_UPDATE']);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['username'])) {
                    return [
                        'success' => true,
                        'username' => $data['username']
                    ];
                }
            }
        } catch (Exception $e) {
            Log::error("Vjudge cookie validation error: " . $e->getMessage());
        }

        return [
            'success' => false,
            'error' => 'Invalid cookie'
        ];
    }

    private function processEvent(Event $event): void
    {
        $this->totalProcessed++;
        $this->components->twoColumnDetail(
            "Processing Event [{$this->totalProcessed}/{$this->totalEvents}]",
            $event->title
        );

        $contestId = $this->extractContestId($event->event_link);
        if (!$contestId) {
            $this->components->error("  ├── Invalid contest URL: {$event->event_link}");
            $this->failedUpdates++;
            return;
        }

        $users = $event->rankLists
            ->pluck('users')
            ->flatten()
            ->unique('id')
            ->values();

        if ($users->isEmpty()) {
            $this->components->warn("  ├── No users found with Vjudge handles");
            $this->failedUpdates++;
            return;
        }

        $this->line("  ├── Found " . $users->count() . " users to process");
        $this->processContest($event, $users, $contestId);
    }

    private function extractContestId(string $eventLink): ?string
    {
        if (preg_match('/contest\\/(\\d+)/', $eventLink, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function processContest(Event $event, Collection $users, string $contestId): void
    {
        try {
            $this->line("  ├── Fetching standings from Vjudge API");

            $headers = [
                'accept' => '*/*',
                'User-Agent' => 'Mozilla/5.0',
                'x-requested-with' => 'XMLHttpRequest'
            ];

            if ($this->cookie) {
                $headers['cookie'] = $this->cookie;
            }

            $response = Http::withHeaders($headers)
                ->get(self::VJUDGE_API['BASE_URL'] . self::VJUDGE_API['ENDPOINTS']['CONTEST_RANK'] . '/' . $contestId);

            if (!$response->successful()) {
                $error = $this->cookie ? "Failed to fetch data" : "AUTH_REQUIRED";
                $this->components->error("  ├── API request failed: " . $error);
                Log::error("Vjudge API error for contest {$contestId}: " . $error);
                $this->failedUpdates++;
                return;
            }

            $data = $response->json();
            if (!$this->isValidContestData($data)) {
                $this->components->error("  ├── Invalid contest data format");
                $this->failedUpdates++;
                return;
            }

            $processedData = $this->processVjudgeData($data);
            $this->updateSolveStats($event, $users, $processedData);

            $this->successfulUpdates++;
            $this->components->info("  └── Update completed successfully");

        } catch (Exception $e) {
            $this->components->error("  └── Error: " . $e->getMessage());
            Log::error("Error processing contest {$contestId}: " . $e->getMessage());
            $this->failedUpdates++;
        }
    }

    private function isValidContestData($data): bool
    {
        return is_array($data) &&
            isset($data['length']) &&
            is_numeric($data['length']) &&
            isset($data['participants']) &&
            is_array($data['participants']);
    }

    private function processVjudgeData(array $data): array
    {
        $timeLimit = $data['length'] / 1000;
        $processed = [];

        foreach ($data['participants'] as $participant) {
            $username = $participant[0];
            $processed[$username] = [
                'solve_count' => 0,
                'upsolve_count' => 0,
                'absent' => true,
                'solved' => array_fill(0, 50, 0)
            ];
        }

        if (isset($data['submissions']) && is_array($data['submissions'])) {
            foreach ($data['submissions'] as [$participantId, $problemIndex, $isAccepted, $timestamp]) {
                $participant = $data['participants'][$participantId] ?? null;
                if (!$participant) continue;

                $username = $participant[0];
                if (!isset($processed[$username])) continue;

                if ($timestamp <= $timeLimit) {
                    $processed[$username]['absent'] = false;
                    if ($isAccepted === 1 && !$processed[$username]['solved'][$problemIndex]) {
                        $processed[$username]['solve_count']++;
                        $processed[$username]['solved'][$problemIndex] = 1;
                    }
                } elseif ($isAccepted === 1 && !$processed[$username]['solved'][$problemIndex]) {
                    $processed[$username]['upsolve_count']++;
                    $processed[$username]['solved'][$problemIndex] = 1;
                }
            }
        }

        return $processed;
    }

    private function updateSolveStats(Event $event, Collection $users, array $processedData): void
    {
        $this->line("  ├── Updating database records");

        // Delete existing solve stats
        SolveStat::where('event_id', $event->id)->delete();

        $solveStats = [];
        $tableData = [];
        $totalSolves = 0;
        $totalUpsolves = 0;

        foreach ($users as $user) {
            $stats = $processedData[$user->vjudge_handle] ?? null;
            $solveCount = $stats ? $stats['solve_count'] : 0;
            $upsolveCount = $stats ? $stats['upsolve_count'] : 0;

            $totalSolves += $solveCount;
            $totalUpsolves += $upsolveCount;

            $solveStats[] = [
                'user_id' => $user->id,
                'event_id' => $event->id,
                'solve_count' => $solveCount,
                'upsolve_count' => $upsolveCount,
                'is_present' => $stats ? !$stats['absent'] : false
            ];

            $tableData[] = [
                $user->vjudge_handle,
                $solveCount,
                $upsolveCount,
                $solveCount + $upsolveCount,
                $stats && !$stats['absent'] ? '<fg=green>Yes</>' : '<fg=red>No</>'
            ];
        }

        // Display stats table
        $this->newLine();
        $this->table(
            ['Handle', 'Contest Solves', 'Upsolves', 'Total', 'Present'],
            $tableData
        );

        // Show summary
        $this->line("  ├── Summary:");
        $this->line("  │   ├── Total Users: " . count($users));
        $this->line("  │   ├── Total Contest Solves: <fg=yellow>{$totalSolves}</>");
        $this->line("  │   ├── Total Upsolves: <fg=yellow>{$totalUpsolves}</>");
        $this->line("  │   └── Total Problems Solved: <fg=yellow>" . ($totalSolves + $totalUpsolves) . "</>");

        // Batch insert the solve stats
        $chunks = array_chunk($solveStats, 100);
        foreach ($chunks as $chunk) {
            SolveStat::insert($chunk);
        }
    }



    private function displaySummary(): void
    {
        $endTime = new DateTime();
        $duration = $endTime->getTimestamp() - $this->startTime->getTimestamp();

        $this->newLine();
        $this->components->info('📊 Update Process Summary');
        $this->newLine();
        $this->line("Started at:               <fg=blue>{$this->startTime->format('Y-m-d H:i:s')} UTC</>");
        $this->line("Completed at:             <fg=blue>{$endTime->format('Y-m-d H:i:s')} UTC</>");
        $this->line("Duration:                 <fg=blue>" . $this->formatDuration($duration) . "</>");
        $this->line("Executed by:              <fg=blue>{$this->currentUser}</>");
        $this->line("Total Events Processed:    <fg=yellow>{$this->totalEvents}</>");
        $this->line("Successful Updates:        <fg=green>{$this->successfulUpdates}</>");
        $this->line("Failed Updates:           <fg=red>{$this->failedUpdates}</>");
        $this->newLine();

        if ($this->failedUpdates > 0) {
            $this->components->warn('Some updates failed. Check the logs for more details.');
        } else {
            $this->components->info('✨ All updates completed successfully!');
        }
        $this->newLine();

        // Display authentication status in summary
        if ($this->authenticatedUsername) {
            $this->line("Authentication Status:    <fg=green>Authenticated as {$this->authenticatedUsername}</>");
        } else {
            $this->line("Authentication Status:    <fg=yellow>Not authenticated</>");
        }
        $this->newLine();
    }

    private function formatDuration(int $seconds): string
    {
        if ($seconds < 60) {
            return $seconds . ' seconds';
        }

        $minutes = floor($seconds / 60);
        $seconds = $seconds % 60;

        if ($minutes < 60) {
            return sprintf('%d minutes %d seconds', $minutes, $seconds);
        }

        $hours = floor($minutes / 60);
        $minutes = $minutes % 60;

        return sprintf('%d hours %d minutes %d seconds', $hours, $minutes, $seconds);
    }

    private function askWithoutQuotes(string $question): string
    {
        $answer = $this->ask($question);
        return trim($answer, '"\''); // Remove quotes if present
    }
}
