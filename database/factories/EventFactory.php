<?php

namespace Database\Factories;

use App\Enums\EventAttendanceScopes;
use App\Enums\EventTypes;
use App\Enums\VisibilityStatuses;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $startingAt = fake()->dateTimeBetween('now', '+2 months');
        $endingAt = Carbon::instance($startingAt)->addMinutes(fake()->numberBetween(60, 300));

        $eventTypes = [
            EventTypes::CONTEST->value => [
                'titles' => [
                    'Weekly Programming Contest',
                    'Competitive Programming Round',
                    'Code Sprint Challenge',
                    'Algorithm Battle',
                    'Hackathon',
                ],
                'descriptions' => [
                    'Join us for an exciting programming contest! Test your skills against other participants.',
                    'Solve algorithmic problems and compete with fellow programmers.',
                    'A challenging contest focusing on data structures and algorithms.',
                ],
            ],
            EventTypes::_CLASS->value => [
                'titles' => [
                    'Data Structures Workshop',
                    'Algorithm Master Class',
                    'CP Tutorial Session',
                    'Problem Solving Class',
                    'Interview Preparation Class',
                ],
                'descriptions' => [
                    'Learn essential concepts and improve your problem-solving skills.',
                    'Interactive session covering important programming topics.',
                    'Hands-on workshop to enhance your coding abilities.',
                ],
            ],
            EventTypes::OTHER->value => [
                'titles' => [
                    'Tech Talk Session',
                    'Career in Competitive Programming',
                    'Meet & Greet',
                    'Programming Community Meetup',
                ],
                'descriptions' => [
                    'Join us for an informative session about programming careers.',
                    'Network with fellow programmers and share experiences.',
                    'Special event for programming enthusiasts.',
                ],
            ],
        ];

        $type = fake()->randomElement(EventTypes::cases());
        $titles = $eventTypes[$type->value]['titles'];
        $descriptions = $eventTypes[$type->value]['descriptions'];

        return [
            'title' => fake()->randomElement($titles),
            'description' => fake()->randomElement($descriptions),
            'status' => fake()->randomElement([
                VisibilityStatuses::PUBLISHED,
                VisibilityStatuses::DRAFT,
                VisibilityStatuses::PRIVATE,
            ]),
            'starting_at' => $startingAt,
            'ending_at' => $endingAt,
            'event_link' => fake()->boolean(80) ? fake()->url() : null,
            'event_password' => fake()->boolean(30) ? fake()->password(8, 12) : null,
            'open_for_attendance' => fake()->boolean(80), // 80% chance of being open
            'type' => $type,
            'attendance_scope' => fake()->randomElement(EventAttendanceScopes::cases()),
            'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Configure the event as published
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => VisibilityStatuses::PUBLISHED,
            'open_for_attendance' => true,
        ]);
    }

    /**
     * Configure the event as a contest
     */
    public function contest(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => EventTypes::CONTEST,
        ]);
    }

    /**
     * Configure the event as a class
     */
    public function class(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => EventTypes::_CLASS,
        ]);
    }

    /**
     * Configure the event for junior programmers
     */
    public function forJuniorProgrammers(): static
    {
        return $this->state(fn (array $attributes) => [
            'attendance_scope' => EventAttendanceScopes::JUNIOR_PROGRAMMERS,
        ]);
    }

    /**
     * Configure the event for girls only
     */
    public function forGirls(): static
    {
        return $this->state(fn (array $attributes) => [
            'attendance_scope' => EventAttendanceScopes::ONLY_GIRLS,
        ]);
    }

    /**
     * Configure the event to start soon (within next 24 hours)
     */
    public function startingSoon(): static
    {
        return $this->state(function (array $attributes) {
            $startingAt = fake()->dateTimeBetween('now', '+24 hours');
            return [
                'starting_at' => $startingAt,
                'ending_at' => Carbon::instance($startingAt)->addMinutes(fake()->numberBetween(60, 180)),
            ];
        });
    }
}
