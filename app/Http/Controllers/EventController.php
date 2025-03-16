<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Filament\Notifications\Notification;

class EventController extends Controller
{
    public function index()
    {
        return Event::with(['attenders', 'solveStats', 'rankLists.tracker'])->latest()->get();
//        return  EventResource::collection(Event::paginate(10));
    }

    public function store(EventRequest $request)
    {
        return new EventResource(Event::create($request->validated()));
    }

    public function show(Event $event)
    {
        $upcomingEvents = Event::where('starting_at', '>', now())
            ->where('id', '!=', $event->id)
            ->orderBy('starting_at')
            ->limit(3)
            ->get();


        return view('events.show', compact('event', 'upcomingEvents'));
    }

    public function update(EventRequest $request, Event $event)
    {
        $event->update($request->validated());

        return new EventResource($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json();
    }
}
