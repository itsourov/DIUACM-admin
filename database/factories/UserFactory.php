<?php

namespace Database\Factories;

use App\Enums\Gender;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(Gender::cases());
        $name = $gender === Gender::FEMALE ? fake()->name('female') : fake()->name('male');
        $username = strtolower(Str::replace('.', '_', fake()->unique()->userName()));

        // Departments commonly found in universities
        $departments = [
            'CSE', 'EEE', 'Civil', 'Mechanical', 'BBA',
            'Economics', 'English', 'Mathematics'
        ];

        // Generate a realistic student ID (e.g., 20-44032-1)
        $year = fake()->numberBetween(19, 23);
        $serialNumber = fake()->numberBetween(40000, 49999);
        $studentId = sprintf('%d-%d-1', $year, $serialNumber);

        // Generate realistic semester information
        $semesters = [
            'Spring 2023', 'Fall 2023', 'Summer 2023',
            'Spring 2024', 'Fall 2024', 'Summer 2024'
        ];

        // Function to generate programming handles
        $generateHandle = fn() => fake()->boolean(70) ?
            $username . fake()->numberBetween(1, 999) : null;

        return [
            'name' => $name,
            'email' => fake()->unique()->safeEmail(),
            'username' => $username,
            'email_verified_at' => fake()->boolean(80) ? now() : null,
            'password' => static::$password ??= Hash::make('password'),
            'gender' => $gender,
            'phone' => '+880' . fake()->numberBetween(1300000000, 1999999999),
            'codeforces_handle' => $generateHandle(),
            'atcoder_handle' => $generateHandle(),
            'vjudge_handle' => $generateHandle(),
            'starting_semester' => fake()->randomElement($semesters),
            'department' => fake()->randomElement($departments),
            'student_id' => $studentId,
            'max_cf_rating' => fake()->boolean(70) ?
                fake()->numberBetween(800, 2100) : null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Create a user with competitive programming profile.
     */
    public function competitive(): static
    {
        return $this->state(fn (array $attributes) => [
            'codeforces_handle' => $attributes['username'] . fake()->numberBetween(1, 999),
            'atcoder_handle' => $attributes['username'] . fake()->numberBetween(1, 999),
            'vjudge_handle' => $attributes['username'] . fake()->numberBetween(1, 999),
            'max_cf_rating' => fake()->numberBetween(1200, 2100),
        ]);
    }

    /**
     * Create a high-rated competitive programmer.
     */
    public function highRated(): static
    {
        return $this->competitive()->state(fn (array $attributes) => [
            'max_cf_rating' => fake()->numberBetween(1800, 3000),
        ]);
    }
}
