<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class RankList extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'session',
        'description',
        'weight_of_upsolve',
    ];

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class)->withPivot('weight');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('score');
    }
}
