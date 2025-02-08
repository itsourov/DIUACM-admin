<?php

namespace Database\Factories;

use App\Models\RankList;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class RankListFactory extends Factory
{
    protected $model = RankList::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->word(),
            'session' => $this->faker->word(),
            'description' => $this->faker->text(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
