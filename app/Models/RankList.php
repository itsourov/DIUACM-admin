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
    ];

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class)->withPivot('weight');
    }
}
