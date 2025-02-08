<section class="py-20 bg-gray-50 dark:bg-gray-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Training Process
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
                Our systematic approach to developing competitive programmers
            </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-12">
            <div class="space-y-8">
                @foreach([
                    [
                        'title' => "Regular Practice Sessions",
                        'description' => "Weekly onsite contests every Friday to maintain consistency",
                        'icon' => "timer",
                        'color' => "text-blue-500"
                    ],
                    [
                        'title' => "Trainer Classes",
                        'description' => "Specialized sessions on advanced topics by experienced mentors",
                        'icon' => "graduation-cap",
                        'color' => "text-purple-500"
                    ],
                    [
                        'title' => "Progress Tracking",
                        'description' => "Individual Contest Tracker to monitor your growth",
                        'icon' => "target",
                        'color' => "text-green-500"
                    ]
                ] as $item)
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                            <i data-lucide="{{ $item['icon'] }}" class="w-6 h-6 {{ $item['color'] }}"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $item['title'] }}</h3>
                            <p class="text-gray-600 dark:text-gray-400">{{ $item['description'] }}</p>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Path to Success</h3>
                <div class="space-y-6">
                    @foreach([
                        [
                            'phase' => "Phase 1: Fundamentals",
                            'details' => "Master basic programming concepts through Green Sheet problems",
                            'progress' => "60% completion required"
                        ],
                        [
                            'phase' => "Phase 2: Advanced Concepts",
                            'details' => "Access to Blue Sheet and specialized training",
                            'progress' => "Regular participation expected"
                        ],
                        [
                            'phase' => "Phase 3: Competition Ready",
                            'details' => "National and International contest preparation",
                            'progress' => "Team formation and ICPC training"
                        ]
                    ] as $phase)
                        <div class="relative pl-8 pb-6">
                            <div class="absolute left-0 top-0 bottom-0 w-px bg-blue-200 dark:bg-blue-800">
                                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                            </div>
                            <h4 class="font-bold text-gray-900 dark:text-white mb-2">{{ $phase['phase'] }}</h4>
                            <p class="text-gray-600 dark:text-gray-400 mb-1">{{ $phase['details'] }}</p>
                            <span class="text-sm text-blue-600 dark:text-blue-400">{{ $phase['progress'] }}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</section>