<?php

namespace App\Console\Commands\ContestInfoUpdater;

use App\Models\Event;
use App\Models\SolveStat;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class UpdateSingleCFData extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bot:update-single-cf-data {event_id}';

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
        $eventId = $this->argument('event_id');
        $event = Event::with('rankLists.users')->find($eventId);
        if (!$event) {
            $this->error('event not found for ID: ' . $eventId);
            return;
        }
        if (!Str::contains($event->event_link, 'codeforces.com')) {
            $this->error('event is not a codeforces event: ' . $event->title);
            return;
        }

        $contestId = explode('/', $event->event_link)[4] ?? null;
        if (!is_numeric($contestId)) {
            $this->error('Invalid contest link: ' . $event->event_link);
            return;
        }


        $usernames = $event->rankLists->flatMap(function ($rankList) {

            return $rankList->users->pluck('codeforces_handle');
        })->unique();


        $this->info("Fetching contest standings for event: " . $event->title);
        // complete this code
        $response = Http::get('https://codeforces.com/api/contest.standings', [
            'contestId' => $contestId,
            'showUnofficial' => 'true',
            'handles' => $usernames->join(';')
        ]);
        $this->info('done fetching data');

        if ($response->failed()) {
            $this->error('Failed to fetch contest standings from Codeforces.');
            return;
        }

        $data = $response->json();

        if ($data['status'] !== 'OK') {
            $this->error('Error from Codeforces API: ' . $data['comment']);
            return;
        }


        foreach ($data['result']['rows'] as $row) {
            $handle = $row['party']['members'][0]['handle'];
            $user = $event->rankLists->flatMap->users->firstWhere('codeforces_handle', $handle);

            if ($user) {
                $solveCount = collect($row['problemResults'])->filter(fn($problem) => $problem['points'] > 0)->count();
                $upsolveCount = collect($row['problemResults'])->filter(fn($problem) => $problem['points'] > 0 && $problem['type'] === 'PRACTICE')->count();
                $isPresent = $row['party']['participantType'] === 'CONTESTANT';

                SolveStat::updateOrCreate(
                    ['event_id' => $event->id, 'user_id' => $user->id],
                    ['solve_count' => $solveCount, 'upsolve_count' => $upsolveCount, 'is_present' => $isPresent]
                );
            }
        }


        $this->info('Updated contest standings for event: ' . $event->title);

    }
}
