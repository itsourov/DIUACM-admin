<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required'],
            'description' => ['nullable'],
            'status' => ['required'],
            'starting_at' => ['required', 'date'],
            'ending_at' => ['required', 'date'],
            'event_link' => ['nullable'],
            'event_password' => ['nullable'],
            'open_for_attendance' => ['boolean'],
            'type' => ['required'],
            'attendance_scope' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
