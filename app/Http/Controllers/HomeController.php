<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\RankList;
use App\Models\SolveStat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class HomeController extends Controller
{
    public function index()
    {

        $data = [
            'currentTime' => Carbon::now()->format('Y-m-d H:i:s'),
            'currentUser' => Auth::user()->username ?? 'guest',
        ];

        return view('homepage', $data);
    }

    public function incentive($email)
    {
        $user = User::where('email', $email)->firstOrFail();
        $cfHandle = $user->codeforces_handle;

        $teamSelectionRanklists = RankList::where('id', 4)->orWhere('id', 5)->get();
        $teamSelectionContests = $teamSelectionRanklists->pluck('events')->flatten()->unique('id');
        $participationInTeamSelectionContest = SolveStat::where('user_id', $user->id)->whereIn('event_id', $teamSelectionContests->pluck('id'))->where('is_present', true)->count();
        $totalSolveCountInTeamSelectionContests = SolveStat::where('user_id', $user->id)->whereIn('event_id', $teamSelectionContests->pluck('id'))->sum('solve_count');

        $individualRanklist = RankList::where('id', 1)->get();
        $individualContests = $individualRanklist->pluck('events')->flatten()->unique('id');
        $individualContests = $individualContests->filter(function($event) {
            return str_starts_with($event->event_link, 'https://vjudge.net/contest') && $event->starting_at >'2025-01-01 00:00:00';
        });
        $participationInIndividualContest = SolveStat::where('user_id', $user->id)->whereIn('event_id', $individualContests->pluck('id'))->where('is_present', true)->count();
        $totalSolveCountInIndividualContests = SolveStat::where('user_id', $user->id)->whereIn('event_id', $individualContests->pluck('id'))->sum('solve_count');


        $juniorIndividualRanklist = RankList::where('id', 3)->get();
        $juniorIndividualContests = $juniorIndividualRanklist->pluck('events')->flatten()->unique('id');
        $juniorIndividualContests = $juniorIndividualContests->filter(function($event) {
            return str_starts_with($event->event_link, 'https://vjudge.net/contest') && $event->starting_at >'2025-01-01 00:00:00';
        });
        $participationInJuniorIndividualContest = SolveStat::where('user_id', $user->id)->whereIn('event_id', $juniorIndividualContests->pluck('id'))->where('is_present', true)->count();
        $totalSolveCountInJuniorIndividualContests = SolveStat::where('user_id', $user->id)->whereIn('event_id', $juniorIndividualContests->pluck('id'))->sum('solve_count');





        return [
            'cfHandle' => $cfHandle,
            'totalTeamSelectionContests' => $teamSelectionContests->count(),
            'participationInTeamSelectionContest' => $participationInTeamSelectionContest,
            'totalSolveCountInTeamSelectionContests' => $totalSolveCountInTeamSelectionContests,
            'participationInIndividualContest' => $participationInIndividualContest,
            'totalSolveCountInIndividualContests' => $totalSolveCountInIndividualContests,
            'participationInJuniorIndividualContest' => $participationInJuniorIndividualContest,
            'totalSolveCountInJuniorIndividualContests' => $totalSolveCountInJuniorIndividualContests,

        ];

    }
}
