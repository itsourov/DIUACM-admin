<?php

namespace Database\Factories;

use App\Enums\VisibilityStatuses;
use App\Models\Tracker;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class TrackerFactory extends Factory
{
    protected $model = Tracker::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->word(),
            'status' => VisibilityStatuses::PUBLISHED,
            'slug' => $this->faker->slug(),
            'description' => $this->faker->text(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
