<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\RankList;
use App\Models\SolveStat;
use App\Models\User;
use Illuminate\Console\Command;

class UpdateAtcoderContest extends Command
{
    protected $signature = 'bot:update-atcoder';
    protected $description = 'Update AtCoder stats for all non-archived ranklists';

    private $curl;
    private $currentEventStats = [];
    private $startTime;
    private $currentUser;
    private $processingStartLine;

    public function __construct()
    {
        parent::__construct();
        $this->curl = curl_init();
        curl_setopt_array($this->curl, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
        ));

        $this->startTime = '2025-02-14 09:25:34';
        $this->currentUser = 'itsourov';
    }

    public function __destruct()
    {
        if ($this->curl) {
            curl_close($this->curl);
        }
    }

    public function handle()
    {
        $this->displayHeader();

        $ranklists = RankList::where('is_archived', false)->get();
        $this->line('Found ' . $this->formatValue($ranklists->count()) . ' active ranklists');
        $this->newLine();

        foreach ($ranklists as $ranklist) {
            $this->processRanklist($ranklist);
        }

        $this->displayFooter();
    }

    private function displayHeader()
    {
        $this->line('╔════════════════════════════════════════════════════════════╗');
        $this->line('║                    AtCoder Stats Update                    ║');
        $this->line('╠════════════════════════════════════════════════════════════╣');
        $this->line('║ Started by: ' . str_pad($this->currentUser, 45) . ' ║');
        $this->line('║ Start time: ' . str_pad($this->startTime . ' UTC', 45) . ' ║');
        $this->line('╚════════════════════════════════════════════════════════════╝');
        $this->newLine();
    }

    private function displayFooter()
    {
        $this->newLine();
        $endTime = now()->format('Y-m-d H:i:s');
        $this->line('╔════════════════════════════════════════════════════════════╗');
        $this->line('║                      Update Complete                       ║');
        $this->line('║ End time: ' . str_pad($endTime . ' UTC', 45) . ' ║');
        $this->line('╚════════════════════════════════════════════════════════════╝');
    }

    private function processRanklist(RankList $ranklist)
    {
        $this->info($this->formatBox('Processing ranklist: ' . $ranklist->title));

        $events = $ranklist->events()
            ->where('event_link', 'like', '%atcoder.jp%')
            ->get();

        if ($events->isEmpty()) {
            $this->warn('No AtCoder events found in this ranklist');
            $this->newLine();
            return;
        }

        foreach ($events as $event) {
            $this->processEvent($event);
        }
    }

    private function processEvent(Event $event)
    {
        $this->currentEventStats = [
            'title' => $event->title,
            'users' => [],
        ];

        $users = User::whereHas('rankLists', function ($query) use ($event) {
            $query->whereHas('events', function ($q) use ($event) {
                $q->where('events.id', $event->id);
            });
        })->get();

        if ($users->isEmpty()) {
            $this->warn('No users found for event: ' . $event->title);
            return;
        }

        $this->displayEventHeader($event);

        foreach ($users as $user) {
            $this->processUserEvent($event, $user);
        }

        $this->displayEventSummary();
    }

    private function processUserEvent(Event $event, User $user)
    {
        if (!$event || !$user || !(str_contains($event->event_link, 'atcoder.jp'))) {
            $this->recordStats($event, $user, 0, 0, false);
            return;
        }

        $contestDataResponse = cache()->remember('atcoder_main', 60 * 60 * 2, function () {
            return $this->fetchUrl('https://kenkoooo.com/atcoder/resources/contests.json');
        });

        if (!$contestDataResponse) {
            $this->recordStats($event, $user, 0, 0, false);
            return;
        }

        $parsedUrl = parse_url($event->event_link);
        $pathSegments = explode('/', trim($parsedUrl['path'], '/'));
        $contestID = $pathSegments[1] ?? null;

        if (($pathSegments[0] ?? '') !== 'contests' || !$contestID) {
            $this->recordStats($event, $user, 0, 0, false);
            return;
        }

        $atcoder_username = $user->atcoder_handle ?? null;
        if (!$atcoder_username) {
            $this->recordStats($event, $user, 0, 0, false);
            return;
        }

        $contestData = json_decode($contestDataResponse, true);
        $contestInfo = collect($contestData)->firstWhere('id', $contestID);

        if (!$contestInfo) {
            $this->recordStats($event, $user, 0, 0, false);
            return;
        }

        $submissionResponse = $this->fetchUrl(
            "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=$atcoder_username&from_second={$contestInfo['start_epoch_second']}"
        );

        if (!$submissionResponse) {
            $this->recordStats($event, $user, 0, 0, false);
            return;
        }

        $submissions = json_decode($submissionResponse, true);
        $solvedProblems = [];
        $upsolvedProblems = [];
        $absent = true;
        $contestEnd = $contestInfo['start_epoch_second'] + $contestInfo['duration_second'];

        foreach ($submissions as $submission) {
            if ($submission['contest_id'] !== $contestID) continue;

            $submissionTime = $submission['epoch_second'];
            $problemID = $submission['problem_id'];
            $result = $submission['result'];

            if ($result === 'AC') {
                if ($submissionTime >= $contestInfo['start_epoch_second'] && $submissionTime <= $contestEnd) {
                    $absent = false;
                    $solvedProblems[$problemID] = true;
                } elseif ($submissionTime > $contestEnd && !isset($solvedProblems[$problemID])) {
                    $upsolvedProblems[$problemID] = true;
                }
            } elseif ($submissionTime >= $contestInfo['start_epoch_second'] && $submissionTime <= $contestEnd) {
                $absent = false;
            }
        }

        $this->recordStats(
            $event,
            $user,
            count($solvedProblems),
            count($upsolvedProblems),
            !$absent
        );
    }

    private function recordStats(Event $event, User $user, $solveCount, $upsolveCount, $isPresent)
    {
        SolveStat::updateOrCreate([
            'event_id' => $event->id,
            'user_id' => $user->id,
        ], [
            'solve_count' => $solveCount,
            'upsolve_count' => $upsolveCount,
            'is_present' => $isPresent,
        ]);

        $this->currentEventStats['users'][] = [
            'username' => $user->name,
            'atcoder_handle' => $user->atcoder_handle ?? 'Not set',
            'solved' => $solveCount,
            'upsolved' => $upsolveCount,
            'present' => $isPresent ? '✓' : '✗',
            'timestamp' => date('H:i:s'),
        ];

        $this->displayUserRow(end($this->currentEventStats['users']));
    }

    private function displayEventHeader(Event $event)
    {
        $this->newLine();
        $this->line('┌' . str_repeat('─', 98) . '┐');
        $this->line('│ Event: ' . str_pad($event->title, 90) . '│');
        $this->line('├' . str_repeat('─', 98) . '┤');
        $this->displayTableHeader();
    }

    private function displayTableHeader()
    {
        $format = "│ %-20s │ %-20s │ %-7s │ %-8s │ %-7s │ %-8s │";
        $this->line(sprintf($format,
            'Username',
            'AtCoder Handle',
            'Solved',
            'Upsolved',
            'Present',
            'Time'
        ));
        $this->line('├' . str_repeat('─', 98) . '┤');
    }

    private function displayUserRow($user)
    {
        $format = "│ %-20s │ %-20s │ %-7d │ %-8d │ %-7s │ %-8s │";
        $this->line(sprintf($format,
            $this->truncate($user['username'], 20),
            $this->truncate($user['atcoder_handle'], 20),
            $user['solved'],
            $user['upsolved'],
            $user['present'],
            $user['timestamp']
        ));
        $this->line('├' . str_repeat('─', 98) . '┤');
    }

    private function displayEventSummary()
    {
        $users = $this->currentEventStats['users'];
        $totalUsers = count($users);
        $presentUsers = count(array_filter($users, fn($u) => $u['present'] === '✓'));
        $totalSolved = array_sum(array_column($users, 'solved'));
        $totalUpsolved = array_sum(array_column($users, 'upsolved'));

        $this->line('│ Summary:' . str_pad('', 89) . '│');
        $summaryText = sprintf(
            "Total Users: %d | Present: %d | Problems Solved: %d | Upsolved: %d",
            $totalUsers,
            $presentUsers,
            $totalSolved,
            $totalUpsolved
        );
        $this->line('│ ' . str_pad($summaryText, 96) . ' │');
        $this->line('└' . str_repeat('─', 98) . '┘');
        $this->newLine();
    }

    private function truncate($string, $length)
    {
        return strlen($string) > $length
            ? substr($string, 0, $length - 3) . '...'
            : str_pad($string, $length);
    }

    private function formatValue($value)
    {
        return "<options=bold>$value</>";
    }

    private function formatBox($text)
    {
        return "【 $text 】";
    }

    private function fetchUrl(string $url): false|string
    {
        curl_setopt($this->curl, CURLOPT_URL, $url);
        $response = curl_exec($this->curl);

        if (curl_errno($this->curl)) {
            $this->error('cURL Error: ' . curl_error($this->curl));
            return false;
        }

        return $response;
    }
}
