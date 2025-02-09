<?php

namespace Database\Factories;

use App\Models\SolveStat;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class SolveStatFactory extends Factory
{
    protected $model = SolveStat::class;

    public function definition(): array
    {
        return [
            'solve_count' => $this->faker->randomNumber(),
            'upsolve_count' => $this->faker->randomNumber(),
            'is_present' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
