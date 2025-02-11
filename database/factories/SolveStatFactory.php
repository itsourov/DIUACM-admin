<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\SolveStat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class SolveStatFactory extends Factory
{
    protected $model = SolveStat::class;

    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->id,
            'event_id' => Event::all()->random()->id,
            'solve_count' => $this->faker->randomNumber(),
            'upsolve_count' => $this->faker->randomNumber(),
            'is_present' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
