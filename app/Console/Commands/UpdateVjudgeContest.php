<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\SolveStat;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Carbon\Carbon;

class UpdateVjudgeContest extends Command implements PromptsForMissingInput
{
    protected $signature = 'app:update-vjudge-contest {event_id} {JSESSIONlD}';

    protected $description = 'Update solve statistics for a Vjudge contest with participant data';

    private const VJUDGE_API_BASE = 'https://vjudge.net';
    private const MAX_PROBLEMS = 50;

    private array $stats = [
        'processed' => 0,
        'updated' => 0,
        'errors' => 0,
        'skipped' => 0,
    ];

    public function handle(): int
    {
        $this->displayHeader();

        try {
            $contest = $this->validateAndGetContest();
            if (!$contest) {
                return self::FAILURE;
            }

            $this->displayEventDetails($contest);

            $contestId = $this->extractContestId($contest->event_link);
            if (!$contestId) {
                return self::FAILURE;
            }

            if (!$this->authenticateWithVjudge()) {
                return self::FAILURE;
            }

            $contestData = $this->fetchContestData($contestId);
            if (!$contestData) {
                return self::FAILURE;
            }

            $participantStats = $this->processParticipantData($contestData);
            $this->updateParticipantStats($contest, $participantStats);

            $this->displaySummary();
            return self::SUCCESS;

        } catch (\Exception $e) {
            $this->error('An unexpected error occurred!');
            $this->error($e->getMessage());
            Log::error('Vjudge contest update failed', [
                'event_id' => $this->argument('event_id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return self::FAILURE;
        }
    }

    private function displayHeader(): void
    {
        $this->newLine();
        $this->info('🚀 Vjudge Contest Statistics Updater');
        $this->info('==========================================');
        $this->table(
            ['Current Time (UTC)', 'Executed By'],
            [[
                Carbon::now('UTC')->format('Y-m-d H:i:s'),
                'itsourov'
            ]]
        );
        $this->newLine();
    }

    private function displayEventDetails(Event $contest): void
    {
        $this->info('📝 Event Details:');
        $this->table(
            ['ID', 'Title', 'Link'],
            [[
                $contest->id,
                $contest->title,
                $contest->event_link
            ]]
        );
        $this->newLine();
    }

    private function validateAndGetContest(): ?Event
    {
        $contest = Event::with('users')->find($this->argument('event_id'));

        if (!$contest) {
            $this->error('❌ Contest not found with ID: ' . $this->argument('event_id'));
            return null;
        }

        if (!str_contains($contest->event_link, 'vjudge.net')) {
            $this->error('❌ Invalid contest: Not a Vjudge contest URL');
            return null;
        }

        return $contest;
    }

    private function extractContestId(string $eventLink): ?string
    {
        $parsedUrl = parse_url($eventLink);
        $pathSegments = explode('/', trim($parsedUrl['path'] ?? '', '/'));

        if ($pathSegments[0] !== 'contest' || !isset($pathSegments[1])) {
            $this->error('❌ Invalid contest URL format');
            return null;
        }

        return $pathSegments[1];
    }

    private function authenticateWithVjudge(): bool
    {
        $this->info('🔄 Authenticating with Vjudge...');

        $response = Http::withHeaders($this->getRequestHeaders())
            ->get(self::VJUDGE_API_BASE . '/user/update');

        $email = $response->json('email');

        if (!$email) {
            $this->error('❌ Vjudge authentication failed');
            return false;
        }

        $this->info('✅ Authenticated successfully as: ' . $email);
        return true;
    }

    private function fetchContestData(string $contestId): ?array
    {
        $this->info('🔄 Fetching contest data...');

        $response = Http::withHeaders($this->getRequestHeaders())
            ->get(self::VJUDGE_API_BASE . '/contest/rank/single/' . $contestId);

        if (!$response->successful()) {
            $this->error('❌ Failed to fetch contest data');
            return null;
        }

        $data = $response->json();
        if (empty($data)) {
            $this->error('❌ No data received for contest ID: ' . $contestId);
            return null;
        }

        return $data;
    }

    private function processParticipantData(array $contestData): array
    {
        $this->info('🔄 Processing participant data...');

        $time = ($contestData['length'] ?? 0) / 1000;
        $participants = $contestData['participants'] ?? [];
        $submissions = $contestData['submissions'] ?? [];

        $data = $this->initializeParticipantData($participants);
        $data = $this->processSubmissions($data, $submissions, $participants, $time);

        return $data;
    }

    private function initializeParticipantData(array $participants): array
    {
        return array_reduce(array_keys($participants), function ($carry, $id) use ($participants) {
            $carry[$participants[$id][0]] = [
                'solveCount' => 0,
                'upSolveCount' => 0,
                'absent' => true,
                'solved' => array_fill(0, self::MAX_PROBLEMS, 0),
            ];
            return $carry;
        }, []);
    }

    private function processSubmissions(array $data, array $submissions, array $participants, int $contestTime): array
    {
        $this->output->progressStart(count($submissions));

        foreach ($submissions as $submission) {
            [$participantId, $problemIndex, $accepted, $submitTime] = $submission;
            $userName = $participants[$participantId][0] ?? '';

            if (isset($data[$userName])) {
                $data[$userName]['absent'] = false;

                if ($accepted) {
                    if ($data[$userName]['solved'][$problemIndex] === 0) {
                        if ($submitTime <= $contestTime) {
                            $data[$userName]['solveCount']++;
                        } else {
                            $data[$userName]['upSolveCount']++;
                        }
                        $data[$userName]['solved'][$problemIndex] = 1;
                    }
                }
            }

            $this->output->progressAdvance();
        }

        $this->output->progressFinish();
        $this->newLine();
        return $data;
    }

    private function updateParticipantStats(Event $contest, array $participantStats): void
    {
        $this->info('🔄 Updating participant statistics...');

        $users = $this->getContestUsers($contest);
        $contestUserIds = $contest->users->pluck('id')->toArray();

        $bar = $this->output->createProgressBar(count($users));
        $bar->start();

        foreach ($users as $user) {
            $vjudgeHandle = $user->vjudge_handle;

            if (!$vjudgeHandle) {
                $this->stats['skipped']++;
                $this->warn("⚠️ Skipped user {$user->name} - No Vjudge handle found");
                $bar->advance();
                continue;
            }

            try {
                $stats = $participantStats[$vjudgeHandle] ?? null;

                if ($stats) {
                    // Adjust stats based on whether user is in the contest
//                    if (!in_array($user->id, $contestUserIds)) {
//                        // User not in contest - combine solve_count and upsolve_count
//                        $totalSolves = ($stats['solveCount'] ?? 0) + ($stats['upSolveCount'] ?? 0);
//                        $stats['upSolveCount'] = $totalSolves;
//                        $stats['solveCount'] = 0;
//                    }

                    $this->updateUserStats($user, $contest, $stats);
                    $this->stats['updated']++;
                }
            } catch (\Exception $e) {
                $this->stats['errors']++;
                Log::error('Failed to update stats for user', [
                    'user_id' => $user->id,
                    'vjudge_handle' => $vjudgeHandle,
                    'error' => $e->getMessage()
                ]);
            }

            $this->stats['processed']++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
    }

    private function getContestUsers(Event $contest): Collection
    {
        return $contest->rankLists()
            ->with('users')
            ->get()
            ->pluck('users')
            ->flatten()
            ->unique('id');
    }

    private function updateUserStats($user, Event $contest, ?array $stats): void
    {

        SolveStat::updateOrCreate(
            [
                'event_id' => $contest->id,
                'user_id' => $user->id,
            ],
            [
                'solve_count' => $stats['solveCount'] ?? 0,
                'upsolve_count' => $stats['upSolveCount'] ?? 0,
                'is_present' => !($stats['absent'] ?? true),
                'error' => null,
            ]
        );
    }

    private function getRequestHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'Cookie' => 'JSESSIONlD=' . $this->argument('JSESSIONlD')
        ];
    }

    private function displaySummary(): void
    {
        $this->info('📊 Update Summary:');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Processed', $this->stats['processed']],
                ['Successfully Updated', $this->stats['updated']],
                ['Errors', $this->stats['errors']],
                ['Skipped (No Vjudge Handle)', $this->stats['skipped']],
            ]
        );

        $this->newLine();
        $this->info('✅ Contest statistics update completed at: ' . Carbon::now('UTC')->format('Y-m-d H:i:s'));
    }
}
