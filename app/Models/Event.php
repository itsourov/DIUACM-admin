<?php

namespace App\Models;

use App\Enums\EventAttendanceScopes;
use App\Enums\EventTypes;
use App\Enums\VisibilityStatuses;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }

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

    public function rankLists(): BelongsToMany
    {
        return $this->belongsToMany(RankList::class)->withPivot(['weight', 'strict_attendance']);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function attenders(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function solveStats(): HasMany
    {
        return $this->hasMany(SolveStat::class);
    }
}
