<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class CleanUpCfUsernames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clean-up-cf-usernames';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up Codeforces usernames and update max rating';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Fetch all users with a Codeforces handle
        $users = User::whereNotNull('codeforces_handle')->get();

        if ($users->isEmpty()) {
            $this->info('No users found with Codeforces handles.');
            return;
        }

        // Use a persistent HTTP client
        $client = Http::withOptions([
            'headers' => [
                'Connection' => 'keep-alive', // Keep the connection open for reuse
                'Accept' => 'application/json',
            ],
            'timeout' => 5, // Set a reasonable timeout for each request
        ]);

        foreach ($users as $user) {
            // Extract handle (if it's a URL, clean it up)
            if (!empty($user->codeforces_handle)) {
                $cfHandle = $user->codeforces_handle;
            } else {
                continue;
            }

            if (Str::startsWith($cfHandle, 'https')) {
                $cfHandle = urldecode(explode('/', $cfHandle)[4]);
                $user->update(['codeforces_handle' => $cfHandle]); // Save cleaned username
            }

            $this->info("Checking Codeforces handle: {$cfHandle}");

            // Fetch user info from Codeforces API
            try {
                $response = $client->get("https://codeforces.com/api/user.info?handles={$cfHandle}");
            } catch (ConnectionException $e) {
                $this->warn("Failed to connect to Codeforces handle: {$e->getMessage()}");
                continue;
            }

            if ($response->successful()) {
                $cfData = $response->json();

                if ($cfData['status'] === 'OK' && isset($cfData['result'][0]['maxRating'])) {
                    $maxRating = $cfData['result'][0]['maxRating'];
                    $user->update(['max_cf_rating' => $maxRating, 'codeforces_handle' => $cfData['result'][0]['handle'] ?? null]);
                    $this->info("Updated max rating: {$maxRating}");
                } else {
                    $user->update(['codeforces_handle' => null]);
                    $this->warn("Invalid handle. Setting to null.");
                }
            } else {
                $user->update(['codeforces_handle' => null]);
                $this->warn("API request failed for {$cfHandle}. Handle removed.");
            }

            // Optional: Add a small delay to prevent rate limiting
//            usleep(300000); // 0.3 seconds
        }

        $this->info('Codeforces cleanup completed!');
    }
}
