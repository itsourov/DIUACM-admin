<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\Gender;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;


    public function canAccessPanel(Panel $panel): bool
    {
        return in_array($this->email, [
            'sourov2305101004@diu.edu.bd',
            'ferdouseahmedfoysal@gmail.com'
        ]);
    }

    public $incrementing = false; // Disable auto-increment
    protected $keyType = 'string'; // Use string as primary key type

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string)Str::uuid(); // Generate UUID on create
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'image',
        'username',
        'password',
        'gender',
        'phone',
        'codeforces_handle',
        'atcoder_handle',
        'vjudge_handle',
        'starting_semester',
        'department',
        'student_id',
        'max_cf_rating',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'gender' => Gender::class,
            'max_cf_rating' => 'integer',
        ];
    }

    public function rankLists(): BelongsToMany
    {
        return $this->belongsToMany(RankList::class)->withPivot('weight');
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class)->withTimestamps();
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_members')
            ->withTimestamps();
    }


}
