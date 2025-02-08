<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/events', [EventController::class, 'index'])->name('events');
Route::get('trackers', [EventController::class, 'index'])->name('trackers');
Route::get('/blog', [EventController::class, 'index'])->name('blog');
Route::get('/gallery', [EventController::class, 'index'])->name('gallery');
Route::get('/login', [EventController::class, 'index'])->name('login');
