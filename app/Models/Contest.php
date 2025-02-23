<?php

namespace App\Models;

use App\Enums\ContestType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contest extends Model
{
    protected $fillable = [
        'name',
        'date',
        'university_id',
        'description',
        'type',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'type' => ContestType::class,
        ];
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }
}
