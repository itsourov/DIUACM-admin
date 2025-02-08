<?php

namespace App\Filament\Resources\EventResource\Pages;

use App\Enums\EventAttendanceScopes;
use App\Enums\EventTypes;
use App\Enums\VisibilityStatuses;
use App\Filament\Resources\EventResource;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Http;

class CreateEvent extends CreateRecord
{
    protected static string $resource = EventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('Quick Contest')
                ->form([
                    TextInput::make('contest_link'),
                ])
                ->action(function (array $data): void {
                    $this->updateInfo($data);
                })
        ];
    }

    public function updateInfo($data): void
    {
        $contest_link = $data['contest_link'];
        $parsedUrl = parse_url($contest_link);

        if (isset($parsedUrl['host'])) {
            if ($parsedUrl['host'] == 'codeforces.com') {
                $this->fetchCodeforcesContest($contest_link);
            } elseif ($parsedUrl['host'] == 'atcoder.jp') {
                $this->fetchAtCoderContest($contest_link);
            } elseif ($parsedUrl['host'] == 'vjudge.net') {
                $this->fetchVJudgeContest($contest_link);
            }
        }
    }

    private function fetchCodeforcesContest($contest_link): void
    {
        $contest_id = explode('/', parse_url($contest_link, PHP_URL_PATH))[2] ?? null;
        if (!$contest_id) {
            Notification::make()
                ->title('Invalid Codeforces contest URL')
                ->warning()
                ->send();
            return;
        }

        $res = Http::get('https://codeforces.com/api/contest.list')->json();
        if ($res['status'] == 'OK') {
            foreach ($res['result'] as $contest) {
                if ($contest['id'] == $contest_id) {
                    $this->form->fill([
                        'title' => $contest['name'],
                        'starting_at' => Carbon::createFromTimestamp($contest['startTimeSeconds'], 'Asia/Dhaka')->toDateTimeString(),
                        'ending_at' => Carbon::createFromTimestamp($contest['startTimeSeconds'] + $contest['durationSeconds'], 'Asia/Dhaka')->toDateTimeString(),
                        'event_link' => $contest_link,
                        'type' => EventTypes::CONTEST,
                        'status' => VisibilityStatuses::PUBLISHED,
                        'attendance_scope' => EventAttendanceScopes::OPEN_FOR_ALL,
                    ]);
                    return;
                }
            }
            Notification::make()
                ->title('Contest not found')
                ->warning()
                ->send();
        } else {
            Notification::make()
                ->title('Failed to fetch contest data from Codeforces')
                ->warning()
                ->send();
        }
    }

    private function fetchAtCoderContest($contest_link): void
    {
        try {
            $response = Http::get($contest_link);

            if (!$response->successful()) {
                Notification::make()
                    ->title('Failed to fetch AtCoder contest')
                    ->warning()
                    ->send();
                return;
            }

            $html = $response->body();

            // Get title
            preg_match('/<h1 class="text-center">(.*?)<\/h1>/s', $html, $titleMatches);
            $title = isset($titleMatches[1]) ? trim(strip_tags($titleMatches[1])) : '';

            // Get contest duration text
            preg_match('/Contest Duration:.*?<time class=\'fixtime fixtime-full\'>(.*?)<\/time>.*?<time class=\'fixtime fixtime-full\'>(.*?)<\/time>/s', $html, $timeMatches);

            if (!isset($timeMatches[1]) || !isset($timeMatches[2])) {
                Notification::make()
                    ->title('Could not find contest times')
                    ->warning()
                    ->send();
                return;
            }

            // Parse start and end times
            $startTime = Carbon::parse($timeMatches[1]);
            $endTime = Carbon::parse($timeMatches[2]);

            $this->form->fill([
                'title' => $title,
                'starting_at' => $startTime->setTimezone('Asia/Dhaka')->toDateTimeString(),
                'ending_at' => $endTime->setTimezone('Asia/Dhaka')->toDateTimeString(),
                'event_link' => $contest_link,
                'type' => EventTypes::CONTEST,
                'status' => VisibilityStatuses::PUBLISHED,
                'attendance_scope' => EventAttendanceScopes::OPEN_FOR_ALL,
                'open_for_attendance' => true,
            ]);

        } catch (\Exception $e) {
            Notification::make()
                ->title('Failed to fetch contest data: ' . $e->getMessage())
                ->warning()
                ->send();
        }
    }

    private function fetchVJudgeContest($contest_link): void
    {
        $html = Http::get($contest_link)->body();
        preg_match('/<textarea[^>]*name="dataJson"[^>]*>(.*?)<\/textarea>/s', $html, $matches);

        if (isset($matches[1])) {
            $jsonText = $matches[1]; // Extracted JSON string
            $contest = json_decode($jsonText, true);

            $this->form->fill([
                'title' => html_entity_decode($contest['title']),
                'starting_at' => Carbon::createFromTimestamp($contest['begin'] / 1000, 'Asia/Dhaka')->toDateTimeString(),
                'ending_at' => Carbon::createFromTimestamp($contest['end'] / 1000, 'Asia/Dhaka')->toDateTimeString(),
                'event_link' => $contest_link,
                'type' => EventTypes::CONTEST,
                'status' => VisibilityStatuses::PUBLISHED,
                'attendance_scope' => EventAttendanceScopes::OPEN_FOR_ALL,
                'open_for_attendance' => true,
            ]);
        } else {
            Notification::make()
                ->title('Contest info not found')
                ->warning()
                ->send();
        }
    }


}
