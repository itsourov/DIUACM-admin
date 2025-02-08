<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class OldDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('old-data/events.json');

        // Check if file exists
        if (!File::exists($jsonPath)) {
            $this->command->error('Events JSON file not found!');
            return;
        }

        // Read and decode JSON file
        $jsonData = File::get($jsonPath);
        $events = json_decode($jsonData, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('Error parsing JSON file!');
            return;
        }

        // Counter for inserted records
        $count = 0;

        foreach ($events as $eventData) {
            try {


                $count++;
            } catch (\Exception $e) {
                $this->command->error("Error inserting event: {$eventData['title']} - {$e->getMessage()}");
            }

        }
    }
}

