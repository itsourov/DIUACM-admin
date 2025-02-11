<?php

namespace Database\Factories;

use App\Enums\VisibilityStatuses;
use App\Models\RankList;
use App\Models\Tracker;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class RankListFactory extends Factory
{
    protected $model = RankList::class;

    public function definition(): array
    {
        return [
            'tracker_id' => Tracker::all()->random()->id,
            'title' => $this->faker->word(),
            'session' => $this->faker->word(),
            'description' => $this->faker->text(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
