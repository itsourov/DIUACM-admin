@php
$competitions = [
    [
        'title' => "Take-Off Programming Contest",
        'description' => "Semester-based contest series for beginners with mock, preliminary, and main rounds.",
        'phases' => ["Mock Round", "Preliminary", "Main Contest"],
        'eligibility' => "1st semester students enrolled in Programming & Problem Solving"
    ],
    [
        'title' => "Unlock The Algorithm",
        'description' => "Advanced algorithmic contest focusing on data structures and algorithms.",
        'phases' => ["Mock Round", "Preliminary", "Final Round"],
        'eligibility' => "Students enrolled in Algorithms course"
    ],
    [
        'title' => "DIU ACM Cup",
        'description' => "Tournament-style competition to crown the best programmer each semester.",
        'phases' => ["Group Stage", "Knockouts", "Finals"],
        'eligibility' => "Top 32 regular programmers"
    ]
];
@endphp

<section class="py-20 bg-gray-50 dark:bg-gray-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Competitions
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
                Regular contests to test and improve your skills
            </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
            @foreach($competitions as $competition)
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ $competition['title'] }}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $competition['description'] }}</p>
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phases</h4>
                            <div class="flex flex-wrap gap-2">
                                @foreach($competition['phases'] as $phase)
                                    <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                                        {{ $phase }}
                                    </span>
                                @endforeach
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Eligibility</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $competition['eligibility'] }}</p>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</section>