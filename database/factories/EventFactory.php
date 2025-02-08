<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->word(),
            'description' => $this->faker->text(),
            'status' => $this->faker->word(),
            'starting_at' => Carbon::now(),
            'ending_at' => Carbon::now(),
            'event_link' => $this->faker->word(),
            'event_password' => bcrypt($this->faker->password()),
            'open_for_attendance' => $this->faker->boolean(),
            'type' => $this->faker->word(),
            'attendance_scope' => $this->faker->word(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
