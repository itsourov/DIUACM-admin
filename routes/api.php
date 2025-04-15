<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/events', [EventController::class,'index']);
Route::get('/users', function (Request $request) {
   return User::all();
});

Route::get('/ranklists', function (Request $request) {
    return \App\Models\RankList::with(['users'])->get();
});

Route::get('/incentive-query/{email}', [HomeController::class,'incentive']);

