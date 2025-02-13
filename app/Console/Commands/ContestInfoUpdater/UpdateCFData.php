<?php

namespace App\Console\Commands\ContestInfoUpdater;

use App\Models\Event;
use App\Models\RankList;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\Artisan;

class UpdateCFData extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bot:update-cf-data {rank_list_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $rankListId = $this->argument('rank_list_id');
        if ($rankListId == null || $rankListId == 'all') {
            $rankLists = Ranklist::all();
        } else {
            $rankLists = Ranklist::where('id', '=', $rankListId)->get();
            if (!$rankLists) {
                $this->error('ranklist not found for ID: ' . $rankListId);
                return;
            }
        }
        $rankLists->loadMissing('events');


        foreach ($rankLists as $rankList) {
            $this->info('Updating rank list: ' . $rankList->title);
            foreach ($rankList->events as $event) {
                Artisan::call('bot:update-single-cf-data', [
                    'event_id' => $event->id,
                ]);
//                $this->info('Updated event: ' . $event->title);
            }


        }


    }
}
