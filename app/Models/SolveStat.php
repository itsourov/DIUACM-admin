<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolveStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_id',
        'solve_count',
        'upsolve_count',
        'is_present',
    ];

    protected function casts(): array
    {
        return [
            'is_present' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
