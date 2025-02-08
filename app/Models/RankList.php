<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankList extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'session',
        'description',
    ];
}
