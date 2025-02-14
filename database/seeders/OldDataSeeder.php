<?php

namespace Database\Seeders;

use App\Enums\VisibilityStatuses;
use App\Models\Event;
use App\Models\RankList;
use App\Models\Tracker;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class OldDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $tracker = Tracker::updateOrCreate([
            'title' => 'Individual Contest Tracker',
        ], [
            'title' => 'Individual Contest Tracker',
            'description' => 'Individual Contest Tracker',
            'slug' => Str::slug('Individual Contest Tracker', '-'),
            'status' => VisibilityStatuses::PUBLISHED,
        ]);

        $rankList = RankList::updateOrCreate([
            'tracker_id' => $tracker->id,
            'session' => '2024-2025',
        ], [
            'tracker_id' => $tracker->id,
            'session' => '2024-2025',
            'title' => 'Individual Contest Tracker (2024-2025)',
        ]);


        $jsonPath = database_path('old-data/events.json');

        // Check if file exists
        if (!File::exists($jsonPath)) {
            $this->command->error('Events JSON file not found!');
            return;
        }

        // Read and decode JSON file
        $jsonData = File::get($jsonPath);
        $events = json_decode($jsonData, true);
        $events = $events[2]['data'];

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('Error parsing JSON file!');
            return;
        }

        // Counter for inserted records
        $count = 0;

        foreach ($events as $eventData) {
            try {

                if ($eventData['deleted_at']) continue;
                $event = Event::create(
                    [
                        'title' => $eventData['title'],
                        'description' => $eventData['description'],
                        'starting_at' => Carbon::make($eventData['starting_time'])->timezone('Asia/Dhaka'),
                        'ending_at' => Carbon::make($eventData['ending_time'])->timezone('Asia/Dhaka'),
                        'event_link' => $eventData['contest_link'],
                        'event_password' => $eventData['password'],
                        'open_for_attendance' => $eventData['open_for_attendance'],
                        'type' => $eventData['type'],
                        'status' => $eventData['visibility'],
                    ]
                );

                $rankList->events()->syncWithoutDetaching($event->id);


                $count++;
            } catch (\Exception $e) {
                $this->command->error("Error inserting event: {$eventData['title']} - {$e->getMessage()}");
            }

        }


        $jsonPath = database_path('old-data/users.json');

        // Check if file exists
        if (!File::exists($jsonPath)) {
            $this->command->error('Users JSON file not found!');
            return;
        }

        // Read and decode JSON file
        $jsonData = File::get($jsonPath);
        $users = json_decode($jsonData, true);
        $users = $users[2]['data'];

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('Error parsing JSON file!');
            return;
        }

        // Counter for inserted records
        $count = 0;

        foreach ($users as $UserData) {
            try {
                if ($UserData['deleted_at']) continue;

                $user = User::create(
                    [
                        'name' => $UserData['name'],
                        'username' => $UserData['username'],
                        'email' => $UserData['email'],
                        'phone' => $UserData['phone'] ?? "asd",
                        'student_id' => $UserData['student_id'],
                        'codeforces_handle' => $UserData['codeforces_username'],
                        'vjudge_handle' => $UserData['vjudge_username'],
                        'atcoder_handle' => $UserData['atcoder_username'],
                        'email_verified_at' => $UserData['email_verified_at'],
                        'password' => $UserData['password'],

                    ]
                );



                $count++;
            } catch (\Exception $e) {
                $this->command->error("Error inserting user: {$UserData['email']} - {$e->getMessage()}");
            }

        }
    }
}

