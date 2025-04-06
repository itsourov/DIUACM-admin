<?php

namespace App\Console\Commands;

use App\Models\RankList;
use App\Models\SolveStat;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RecalculateRanklistScore extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:recalculate-ranklist-score {ranklist_id? : Optional ID of specific ranklist to recalculate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculate and update scores for all users in all ranklists or a specific ranklist';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $rankListId = $this->argument('ranklist_id');
        
        if ($rankListId) {
            $rankLists = RankList::where('id', $rankListId)->get();
            if ($rankLists->isEmpty()) {
                $this->error("Ranklist with ID {$rankListId} not found.");
                return 1;
            }
            $this->info("Recalculating scores for ranklist: {$rankLists[0]->title}");
        } else {
            $rankLists = RankList::all();
            $this->info("Recalculating scores for all ranklists...");
        }
        
        $progressBar = $this->output->createProgressBar(count($rankLists));
        $progressBar->start();
        
        foreach ($rankLists as $rankList) {
            $this->recalculateRanklistScores($rankList);
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine();
        $this->info("Ranklist scores have been recalculated successfully!");
        
        return 0;
    }
    
    /**
     * Recalculate scores for a specific ranklist
     */
    private function recalculateRanklistScores(RankList $rankList): void
    {
        // Get all users
        $users = $rankList->users()->get();
        if ($users->isEmpty()) {
            $this->line(" - No users found for ranklist: {$rankList->title}");
            return;
        }
        
        // Get all events in this ranklist with their weights
        $events = $rankList->events()->get();
        
        // Track updated user count
        $updatedCount = 0;
        
        foreach ($users as $user) {
            // Calculate total score for this user in this ranklist
            $totalScore = 0;
            
            foreach ($events as $event) {
                // Get event weight in this ranklist
                $eventWeight = $event->pivot->weight ?? 1;
                
                // Get user's solve stats for this event
                $solveStat = SolveStat::where('user_id', $user->id)
                    ->where('event_id', $event->id)
                    ->first();
                
                if ($solveStat) {
                    // Add solve count score weighted by event weight
                    $solveScore = $solveStat->solve_count * $eventWeight;
                    $totalScore += $solveScore;
                    
                    // Add upsolve count score if applicable
                    if ($rankList->weight_of_upsolve > 0 && $solveStat->upsolve_count > 0) {
                        $upsolveScore = $solveStat->upsolve_count * ($rankList->weight_of_upsolve / 100) * $eventWeight;
                        $totalScore += $upsolveScore;
                    }
                }
            }
            
            // Update or create user's score in this ranklist
            DB::table('rank_list_user')
                ->updateOrInsert(
                    ['rank_list_id' => $rankList->id, 'user_id' => $user->id],
                    ['score' => $totalScore]
                );
            
            $updatedCount++;
        }
        
        $this->line(" - Updated {$updatedCount} users for ranklist: {$rankList->title}");
    }
}
