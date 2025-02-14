<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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
}
