<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\RankList;
use App\Models\SolveStat;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;

class UpdateCFContest extends Command
{
    protected $signature = 'app:update-cf-contest';
    protected $description = 'Update solve statistics for CodeForces contests';

    private int $totalProcessed = 0;
    private int $totalEvents = 0;
    private int $successfulUpdates = 0;
    private int $failedUpdates = 0;

    public function handle(): void
    {
        $this->newLine();
        $this->components->info('🚀 Starting CodeForces Contest Update Process');
        $this->newLine();

        // Eager load all necessary relationships in a single query
        $this->components->task('Loading ranklists and events', function() {
            $rankLists = RankList::where('is_archived', false)
                ->with([
                    'events' => function ($query) {
                        $query->whereRaw('event_link LIKE ?', ['%codeforces.com%']);
                    },
                    'events.rankLists.users' => function ($query) {
                        $query->whereNotNull('codeforces_handle')
                            ->select('users.id', 'users.codeforces_handle');
                    }
                ])
                ->get();

            $events = $rankLists->pluck('events')->flatten()->unique('id');
            $this->totalEvents = $events->count();

            if ($this->totalEvents === 0) {
                $this->components->warn('No CodeForces contests found to process');
                return false;
            }

            $this->line("Found {$this->totalEvents} CodeForces contests to process");
            $this->newLine();

            foreach ($events as $event) {
                $this->processEvent($event);
            }

            return true;
        });

        // Display final summary
        $this->newLine();
        $this->components->info('📊 Update Process Summary');
        $this->newLine();
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
            $this->components->warn("  ├── No users found with CodeForces handles");
            $this->failedUpdates++;
            return;
        }

        $this->line("  ├── Found " . $users->count() . " users to process");
        $this->processContest($event, $users, $contestId);
    }

    private function extractContestId(string $eventLink): ?string
    {
        if (preg_match('/contests\/(\d+)/', $eventLink, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function processContest(Event $event, Collection $users, string $contestId): void
    {
        $handles = $users->pluck('codeforces_handle')->join(';');

        try {
            $this->line("  ├── Fetching standings from CodeForces API");

            $response = Http::get('https://codeforces.com/api/contest.standings', [
                'contestId' => $contestId,
                'showUnofficial' => true,
                'handles' => $handles
            ]);

            if (!$response->successful()) {
                $this->components->error("  ├── API request failed: " . $response->body());
                Log::error("CodeForces API error: " . $response->body());
                $this->failedUpdates++;
                return;
            }

            $data = $response->json();

            $solveStats = $this->prepareBatchUpdateData($event, $users, $data);
            $this->batchUpsertSolveStats($solveStats);

            $this->successfulUpdates++;
            $this->components->info("  └── Update completed successfully");

        } catch (\Exception $e) {
            $this->components->error("  └── Error: " . $e->getMessage());
            Log::error("Error processing contest {$contestId}: " . $e->getMessage());
            $this->failedUpdates++;
        }
    }

    private function prepareBatchUpdateData(Event $event, Collection $users, array $data): array
    {
        $solveStats = [];
        $rows = collect($data['result']['rows']);
        $this->line("  ├── Processing user statistics");

        // Prepare table headers
        $tableData = [];
        $totalSolves = 0;
        $totalUpsolves = 0;

        foreach ($users as $user) {
            $contestRow = $rows->first(function ($row) use ($user) {
                return strtolower($row['party']['members'][0]['handle']) === strtolower($user->codeforces_handle)
                    && $row['party']['participantType'] === 'CONTESTANT';
            });

            $practiceRow = $rows->first(function ($row) use ($user) {
                return strtolower($row['party']['members'][0]['handle']) === strtolower($user->codeforces_handle)
                    && $row['party']['participantType'] === 'PRACTICE';
            });

            $stats = $this->calculateDetailedUserStats($contestRow, $practiceRow);

            $totalSolves += $stats['solve_count'];
            $totalUpsolves += $stats['upsolve_count'];

            $solveStats[] = [
                'user_id' => $user->id,
                'event_id' => $event->id,
                'solve_count' => $stats['solve_count'],
                'upsolve_count' => $stats['upsolve_count'],
                'is_present' => !empty($contestRow),
            ];

            // Add row to table data
            $tableData[] = [
                $user->codeforces_handle,
                $stats['solve_count'],
                $stats['upsolve_count'],
                $stats['solve_count'] + $stats['upsolve_count'],
                !empty($contestRow) ? '<fg=green>Yes</>' : '<fg=red>No</>'
            ];
        }

        $this->newLine();
        $this->components->info("  ├── Statistics for {$event->title}");

        // Display stats table
        $this->table(
            ['Handle', 'Contest Solves', 'Upsolves', 'Total', 'Participated'],
            $tableData
        );

        // Show summary
        $this->line("  ├── Summary:");
        $this->line("  │   ├── Total Users: " . count($users));
        $this->line("  │   ├── Total Contest Solves: <fg=yellow>{$totalSolves}</>");
        $this->line("  │   ├── Total Upsolves: <fg=yellow>{$totalUpsolves}</>");
        $this->line("  │   └── Total Problems Solved: <fg=yellow>" . ($totalSolves + $totalUpsolves) . "</>");
        $this->newLine();

        return $solveStats;
    }

    private function calculateDetailedUserStats(?array $contestRow, ?array $practiceRow): array
    {
        $solveCount = 0;
        $contestSolvedProblems = [];

        if ($contestRow) {
            foreach ($contestRow['problemResults'] as $index => $problem) {
                if ($problem['points'] > 0) {
                    $solveCount++;
                    $contestSolvedProblems[] = $index;
                }
            }
        }

        $upsolveCount = 0;
        if ($practiceRow) {
            foreach ($practiceRow['problemResults'] as $index => $problem) {
                if ($problem['points'] > 0 && !in_array($index, $contestSolvedProblems)) {
                    $upsolveCount++;
                }
            }
        }

        return [
            'solve_count' => $solveCount,
            'upsolve_count' => $upsolveCount
        ];
    }

    private function batchUpsertSolveStats(array $solveStats): void
    {
        $this->line("  ├── Updating database records");

        $chunks = array_chunk($solveStats, 100);
        $progress = $this->output->createProgressBar(count($chunks));
        $progress->setFormat('  ├── %current%/%max% [%bar%] %percent:3s%%');

        foreach ($chunks as $chunk) {
            SolveStat::upsert(
                $chunk,
                ['user_id', 'event_id'],
                ['solve_count', 'upsolve_count', 'is_present']
            );
            $progress->advance();
        }

        $progress->finish();
        $this->newLine();
    }
}
