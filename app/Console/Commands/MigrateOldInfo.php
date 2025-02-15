<?php

namespace App\Console\Commands;

use App\Enums\EventAttendanceScopes;
use App\Enums\VisibilityStatuses;
use App\Models\Event;
use App\Models\RankList;
use App\Models\Tracker;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MigrateOldInfo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-old-info';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';
    protected string $baseUrl = 'https://diuacm.com/api';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->getUsers();
        $this->getEvents();
    }

    private function getUsers()
    {
        $users = Http::withHeaders([
            'Authorization' => config('app.key'),
        ])->get($this->baseUrl . '/users')->json();
        $this->info('Total users found: ' . count($users));

        $profileImages = Http::get($this->baseUrl . '/pp')->json();
        foreach ($users as $user) {

            User::updateOrCreate(
                [
                    'email' => $user['email']
                ],
                [
                    'name' => $user['name'],
                    'image' => $profileImages[$user['email']]['profile_image_url'] === 'https://diuacm.com/images/user.png' ? null : $profileImages[$user['email']]['profile_image_url'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'phone' => $user['phone'],
                    'student_id' => $user['student_id'],
                    'codeforces_handle' => $user['codeforces_username'],
                    'vjudge_handle' => $user['vjudge_username'],
                    'atcoder_handle' => $user['atcoder_username'],
                    'email_verified_at' => Carbon::make($user['email_verified_at'])?->timezone('Asia/Dhaka'),
                    'password' => $user['password'],
                    'created_at' => Carbon::make($user['created_at'])->timezone('Asia/Dhaka'),
                    'updated_at' => Carbon::make($user['updated_at'])->timezone('Asia/Dhaka')

                ]);
            $this->info('User ' . $user['name'] . ' migrated successfully');
        }


    }

    private function getEvents(): void
    {

        $tracker = Tracker::firstOrCreate([], [
            'title' => 'Individual Contest Tracker',
            'description' => 'Individual Contest Tracker',
            'slug' => Str::slug('Individual Contest Tracker', '-'),
            'status' => VisibilityStatuses::PUBLISHED,
        ]);
        $events = Http::withHeaders([
            'Authorization' => config('app.key'),
        ])->get($this->baseUrl . '/events')->json();

        foreach ($events as $event) {

            $attendanceScope = EventAttendanceScopes::OPEN_FOR_ALL;

            $newEvent = Event::updateOrCreate(
                [
                    'title' => $event['title'],
                    'event_link' => $event['contest_link']
                ],
                [
                    'title' => $event['title'],
                    'description' => $event['description'],
                    'type' => $event['type'],
                    'status' => $event['visibility'],
                    'attendance_scope' => $attendanceScope,
                    'open_for_attendance' => $event['open_for_attendance'],

                    'starting_at' => Carbon::make($event['starting_time']),
                    'ending_at' => Carbon::make($event['ending_time']),
                    'created_at' => Carbon::make($event['created_at']),
                    'updated_at' => Carbon::make($event['updated_at']),
                ]
            );


            foreach ($event['trackers'] ?? [] as $rankList) {

                $newRanklist = RankList::updateOrCreate(
                    [
                        'title' => $rankList['title'],
                    ],
                    [
                        'title' => $rankList['title'],
                        'session' => '2024-1025',
                        'is_archived' => false,
                        'tracker_id' => $tracker->id,
                        'description' => $rankList['description'],
                        'weight_of_upsolve' => 0.25,

                    ]
                );
                $newEvent->rankLists()->attach($newRanklist->id, ['weight' => $event['weight']]);
            }

            foreach ($event['attenders'] ?? [] as $attender) {
                $attenderUser = User::where('email', $attender['email'])->first();
                if (!$attenderUser) $this->error('User not found: ' . $attender['email']);
                $newEvent->attenders()->syncWithoutDetaching($attenderUser->id);
            }

            $this->info('Event ' . $event['title'] . ' migrated successfully');

        }
    }

}
