<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
    ];

    public function contests(): HasMany
    {
        return $this->hasMany(Contest::class);
    }
}
