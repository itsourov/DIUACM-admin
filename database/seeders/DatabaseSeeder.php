<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\RankList;
use App\Models\SolveStat;
use App\Models\Tracker;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use function Pest\Laravel\get;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            OldDataSeeder::class,
        ]);

//        User::factory(10)->create();
//        Event::factory(100)->create();
//
//        Tracker::factory()->create([
//            'title' => 'Individual Contest Tracker',
//            'description' => 'Individual Contest Tracker',
//            'slug' => 'individual-contest-tracker',
//        ]);
//
//        RankList::factory(10)->create();
//        foreach (RankList::with(['events', 'users'])->get() as $rankList) {
//            $rankList->events()->attach(Event::all()->random(30)->pluck('id')->toArray());
//            $rankList->users()->attach(User::all()->random(200)->pluck('id')->toArray());
//
//        }
//        foreach (RankList::with(['events', 'users'])->get() as $rankList) {
//            foreach ($rankList->events as $event) {
//                foreach ($rankList->users as $user) {
//                    SolveStat::updateOrCreate([
//                        'event_id' => $event->id,
//                        'user_id' => $user->id,
//                    ], [
//                        'event_id' => $event->id,
//                        'user_id' => $user->id,
//                        'solve_count' => rand(1, 10),
//                        'upsolve_count' => rand(1, 10),
//                        'is_present' => rand(0, 1),
//                    ]);
//                }
//            }
//        }

//        SolveStat::factory(1000)->create();


    }
}
