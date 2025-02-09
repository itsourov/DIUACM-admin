<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
        return view('events.index');
    }

    public function store(EventRequest $request)
    {
        return new EventResource(Event::create($request->validated()));
    }

    public function show(Event $event)
    {
        return view('events.show', compact('event'));
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
