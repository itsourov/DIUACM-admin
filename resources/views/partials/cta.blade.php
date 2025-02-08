<section class="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
    <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl mx-auto text-center mb-16">
            <div class="space-y-6">
                <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    How to Join DIU ACM
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    We don't have a traditional membership system. Your passion for competitive
                    programming and regular participation makes you a part of our community.
                </p>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
            <div class="space-y-8">
                @foreach([
                    [
                        'title' => "Master the Green Sheet",
                        'description' => "Complete our curated set of beginner-level problems. Aim for 60% completion to become eligible for the Blue Sheet.",
                        'icon' => "book-open",
                        'color' => "text-green-500"
                    ],
                    [
                        'title' => "Join Regular Contests",
                        'description' => "Participate in our weekly onsite DIU Individual Contest every Friday and track your progress through our Individual Contest Tracker.",
                        'icon' => "code-2",
                        'color' => "text-blue-500"
                    ],
                    [
                        'title' => "Visit ACM Lab",
                        'description' => "Come to KT_310 to meet the community and get help with your competitive programming journey.",
                        'icon' => "users",
                        'color' => "text-purple-500"
                    ]
                ] as $step)
                    <div class="flex gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg">
                        <div class="{{ $step['color'] }} mt-1">
                            <i data-lucide="{{ $step['icon'] }}" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {{ $step['title'] }}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400">
                                {{ $step['description'] }}
                            </p>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <div class="space-y-6">
                    <h3 class="text-2xl font-bold">Get Started Today</h3>
                    <p class="text-blue-100">
                        Join our Telegram channel to stay updated with contests, events, and connect with
                        the community.
                    </p>

                    <div class="space-y-4">
                        <h4 class="font-semibold">What you'll get:</h4>
                        <ul class="space-y-3">
                            @foreach([
                                "Contest and event updates",
                                "Access to learning resources",
                                "Community support",
                                "Mentorship opportunities"
                            ] as $benefit)
                                <li class="flex items-center gap-2">
                                    <i data-lucide="check-circle-2" class="w-5 h-5 text-blue-300"></i>
                                    <span>{{ $benefit }}</span>
                                </li>
                            @endforeach
                        </ul>
                    </div>

                    <div class="flex flex-wrap gap-4 pt-4">
                        <button class="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                            <i data-lucide="message-square" class="w-4 h-4"></i> Join Telegram
                        </button>
                        <button class="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                            <i data-lucide="terminal" class="w-4 h-4"></i> Visit Lab
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>