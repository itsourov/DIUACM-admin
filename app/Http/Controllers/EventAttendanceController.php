<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;

class EventAttendanceController extends Controller
{
    public function store(Request $request, Event $event)
    {
        if (!$request->filled('event_password')) {
            Notification::make()
                ->title('Error')
                ->body('Event password is required')
                ->warning()
                ->send();
            return back();
        }

        // Check if event is open for attendance
        if (!$event->open_for_attendance) {
            Notification::make()
                ->title('Error')
                ->body('Event is not open for attendance')
                ->warning()
                ->send();
            return back();
        }

        // Check if event is currently active
        if (!now()->between($event->starting_at, $event->ending_at)) {
            Notification::make()
                ->title('Error')
                ->body('Event is not active at this time')
                ->warning()
                ->send();
            return back();
        }

        // Check if user has already attended
        if ($event->users()->where('user_id', auth()->id())->exists()) {
            Notification::make()
                ->title('Error')
                ->body('You have already attended this event')
                ->warning()
                ->send();
            return back();
        }

        // Verify password
        if ($request->event_password !== $event->event_password) {
            Notification::make()
                ->title('Error')
                ->body('Invalid event password')
                ->warning()
                ->send();
            return back();
        }

        // Record attendance
        $event->users()->attach(auth()->id(), [
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Notification::make()
            ->title('Success')
            ->body('Your attendance has been recorded successfully')
            ->success()
            ->send();

        return back();
    }
}
