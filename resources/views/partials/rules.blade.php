@php
$rules = [
    'contests' => [
        "No external website usage during contests except the platform",
        "Hard copy templates are allowed with specified limits",
        "Code sharing must be enabled on Vjudge contests",
        "Any form of plagiarism results in permanent ban"
    ],
    'lab' => [
        "Lab access requires regular ACM programmer status",
        "Maintain respectful behavior towards seniors and teachers",
        "Avoid disturbing others during practice sessions",
        "Keep the lab clean and organized"
    ],
    'online' => [
        "Forum usage prohibited during online contests",
        "Basic resource websites (GFG, CPAlgo) are allowed",
        "Maintain code submission history",
        "Report technical issues immediately"
    ]
];
@endphp

<section class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Rules & Guidelines
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
                Essential rules to maintain the integrity of our competitive programming community
            </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <div class="flex items-center gap-3 mb-6">
                    <i data-lucide="trophy" class="w-6 h-6 text-amber-500"></i>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Contest Rules</h3>
                </div>
                <ul class="space-y-4">
                    @foreach($rules['contests'] as $rule)
                        <li class="flex items-start gap-3">
                            <i data-lucide="check-circle-2" class="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0"></i>
                            <span class="text-gray-600 dark:text-gray-400">{{ $rule }}</span>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <div class="flex items-center gap-3 mb-6">
                    <i data-lucide="laptop" class="w-6 h-6 text-blue-500"></i>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Lab Rules</h3>
                </div>
                <ul class="space-y-4">
                    @foreach($rules['lab'] as $rule)
                        <li class="flex items-start gap-3">
                            <i data-lucide="check-circle-2" class="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0"></i>
                            <span class="text-gray-600 dark:text-gray-400">{{ $rule }}</span>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <div class="flex items-center gap-3 mb-6">
                    <i data-lucide="globe" class="w-6 h-6 text-purple-500"></i>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Online Contest Rules</h3>
                </div>
                <ul class="space-y-4">
                    @foreach($rules['online'] as $rule)
                        <li class="flex items-start gap-3">
                            <i data-lucide="check-circle-2" class="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0"></i>
                            <span class="text-gray-600 dark:text-gray-400">{{ $rule }}</span>
                        </li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
</section>