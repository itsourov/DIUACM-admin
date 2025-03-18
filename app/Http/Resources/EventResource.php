<?php

namespace App\Http\Resources;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Event */
class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'starting_at' => $this->starting_at->timezone('UTC')->format('Y-m-d H:i:s'),
            'ending_at' => $this->ending_at->timezone('UTC')->format('Y-m-d H:i:s'),
            'event_link' => $this->event_link,
            'event_password' => $this->event_password,
            'open_for_attendance' => $this->open_for_attendance,
            'type' => $this->type,
            'attendance_scope' => $this->attendance_scope,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
