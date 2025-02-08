<section class="py-20 bg-gray-50 dark:bg-gray-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
                <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    What is DIU ACM?
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    DIU ACM is the hub for competitive programming excellence at Daffodil International
                    University. We prepare and send teams to prestigious programming contests including ACM
                    ICPC, fostering a community of problem solvers and algorithmic thinkers.
                </p>
                <ul class="space-y-4">
                    @foreach([
                        "Team-based learning environment",
                        "Expert mentorship from seniors",
                        "Regular contest participation",
                        "Structured learning paths"
                    ] as $point)
                        <li class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <i data-lucide="check-circle-2" class="w-5 h-5 text-green-500 flex-shrink-0"></i>
                            {{ $point }}
                        </li>
                    @endforeach
                </ul>
            </div>
            <div class="lg:ml-auto">
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-4">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <i data-lucide="trophy" class="w-8 h-8 text-amber-500 mb-2"></i>
                            <h3 class="font-bold text-gray-900 dark:text-white">Contest Success</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">National & International achievements</p>
                        </div>
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <i data-lucide="brain" class="w-8 h-8 text-purple-500 mb-2"></i>
                            <h3 class="font-bold text-gray-900 dark:text-white">Skill Development</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Structured learning paths</p>
                        </div>
                    </div>
                    <div class="space-y-4 mt-8">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <i data-lucide="users" class="w-8 h-8 text-blue-500 mb-2"></i>
                            <h3 class="font-bold text-gray-900 dark:text-white">Community</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Supportive learning environment</p>
                        </div>
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                            <i data-lucide="target" class="w-8 h-8 text-red-500 mb-2"></i>
                            <h3 class="font-bold text-gray-900 dark:text-white">ICPC Focus</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Dedicated preparation</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>