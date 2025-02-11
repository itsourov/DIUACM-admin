<?php

namespace App\Console\Commands;

use App\Enums\EventAttendanceScopes;
use App\Enums\EventTypes;
use App\Enums\VisibilityStatuses;
use App\Models\Event;
use App\Models\RankList;
use App\Models\Tracker;
use App\Models\User;
use Carbon\Carbon;
use Filament\Notifications\Notification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ImportLegacyContests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-legacy-contests';

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
        $this->import2020Contests();


    }

    private function import2020Contests(): void
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
            'session' => '2020',
        ], [
            'tracker_id' => $tracker->id,
            'session' => '2020',
            'title' => 'Individual Contest Tracker (2020)',
        ]);

        $filePath = storage_path('app/legacy/contests-2020.csv');

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return;
        }

        // Open and read the CSV file
        $handle = fopen($filePath, 'r');
        if (!$handle) {
            $this->error("Unable to open the file.");
            return;
        }

        // Read header row (optional)
        $header = fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);

            $contest_link = $data['Contests'];
            $parsedUrl = parse_url($contest_link);

            if (isset($parsedUrl['host'])) {
                if ($parsedUrl['host'] == 'codeforces.com') {
                    $eventId = $this->createCFContest($contest_link);
                } elseif ($parsedUrl['host'] == 'atcoder.jp') {
//                  $eventId =   $this->fetchAtCoderContest($contest_link);
                } elseif ($parsedUrl['host'] == 'vjudge.net') {
                    $eventId = $this->createVjudgeContest($contest_link);
                }

                $rankList->events()->syncWithoutDetaching($eventId);
            }

        }

        fclose($handle);
        $this->info("CSV file processed successfully.");
    }

    public function createCFContest(string $contest_link)
    {
        $this->info("Fetching cf contest: $contest_link");
        $contest_id = explode('/', parse_url($contest_link, PHP_URL_PATH))[2] ?? null;
        if (!$contest_id) {
            $this->warn("Contest not found: $contest_link");
            return null;
        }


        $res = cache()->remember('cf', 3600, function () {
            return Http::get('https://codeforces.com/api/contest.list')->json();
        });
        if ($res['status'] == 'OK') {
            foreach ($res['result'] as $contest) {
                if ($contest['id'] == $contest_id) {

                    $event = Event::updateOrCreate([
                        'event_link' => 'https://codeforces.com/contest/' . $contest_id,
                    ], [
                        'title' => $contest['name'],
                        'starting_at' => Carbon::createFromTimestamp($contest['startTimeSeconds'])->toDateTimeString(),
                        'ending_at' => Carbon::createFromTimestamp($contest['startTimeSeconds'] + $contest['durationSeconds'])->toDateTimeString(),
                        'event_link' => 'https://codeforces.com/contest/' . $contest_id,
                        'type' => EventTypes::CONTEST,
                        'status' => VisibilityStatuses::PUBLISHED,
                        'attendance_scope' => EventAttendanceScopes::OPEN_FOR_ALL,
                        'open_for_attendance' => false,
                    ]);

                    return $event->id;
                }
            }
            $this->warn("Contest not found: $contest_link");
        } else {
            $this->warn("failed to fetch code for contest: $contest_link");

        }
        return null;

    }

    public function createVjudgeContest(string $contest_link)
    {
        $this->info("Fetching vjudhe contest: $contest_link");

        $html = Http::get($contest_link)->body();
        preg_match('/<textarea[^>]*name="dataJson"[^>]*>(.*?)<\/textarea>/s', $html, $matches);

        if (isset($matches[1])) {
            $jsonText = $matches[1]; // Extracted JSON string
            $contest = json_decode($jsonText, true);

            $event = Event::updateOrCreate([
                'event_link' => Str::before($contest_link, '#'),
            ], [
                'title' => html_entity_decode($contest['title']),
                'starting_at' => Carbon::createFromTimestamp($contest['begin'] / 1000)->toDateTimeString(),
                'ending_at' => Carbon::createFromTimestamp($contest['end'] / 1000)->toDateTimeString(),
                'event_link' => Str::before($contest_link, '#'),
                'type' => EventTypes::CONTEST,
                'status' => VisibilityStatuses::PUBLISHED,
                'attendance_scope' => EventAttendanceScopes::OPEN_FOR_ALL,
                'open_for_attendance' => false,
            ]);
            return $event->id;

        } else {
            $this->warn("Contest not found: $contest_link");
        }
    }
}
