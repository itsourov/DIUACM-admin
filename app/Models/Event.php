<?php

namespace App\Models;

use App\Enums\EventAttendanceScopes;
use App\Enums\EventTypes;
use App\Enums\VisibilityStatuses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'starting_at',
        'ending_at',
        'event_link',
        'event_password',
        'open_for_attendance',
        'type',
        'attendance_scope',
    ];

    protected function casts(): array
    {
        return [
            'starting_at' => 'datetime',
            'ending_at' => 'datetime',
            'open_for_attendance' => 'boolean',
            'status' => VisibilityStatuses::class,
            'type' => EventTypes::class,
            'attendance_scope' => EventAttendanceScopes::class,
        ];
    }
}
