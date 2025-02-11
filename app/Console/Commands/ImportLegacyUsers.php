<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportLegacyUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-legacy-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = storage_path('app/legacy/users.csv');

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return;
        }

        // Open and read the CSV file
        $handle = fopen($filePath, 'r');
        if (!$handle) {
            $this->error("Unable to open the file.");
            return;
        }

        // Read header row (optional)
        $header = fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);

            $id = $data['ID'];
            $name = $data['Name'];
            $email = $data['Email'];
            $phone = $data['Phone'];

            $user = User::updateOrCreate(['email' => $email], [
                'student_id' => $id,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'username' => Str::before($email, '@')
            ]);
            $user->markEmailAsVerified();
        }

        fclose($handle);
        $this->info("CSV file processed successfully.");
    }
}
