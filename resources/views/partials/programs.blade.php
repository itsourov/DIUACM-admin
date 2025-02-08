@php
$programs = [
    [
        'title' => "Green Sheet Program",
        'description' => "Master programming basics with our curated problem set covering fundamental concepts. Solve 60% to qualify for Blue Sheet.",
        'icon' => "file-code-2",
        'color' => "from-green-500 to-emerald-500"
    ],
    [
        'title' => "Blue Sheet Advanced",
        'description' => "1000+ carefully selected problems for advanced programmers. Regular updates based on top solver performance.",
        'icon' => "award",
        'color' => "from-blue-500 to-indigo-500"
    ],
    [
        'title' => "ACM Advanced Camp",
        'description' => "Intensive training program for TOPC top performers with mentoring from seniors and alumni.",
        'icon' => "target",
        'color' => "from-purple-500 to-pink-500"
    ]
];
@endphp

<section class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Learning Programs
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
                Structured paths to excellence in competitive programming
            </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            @foreach($programs as $program)
                <div class="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
                    <i data-lucide="{{ $program['icon'] }}" class="w-12 h-12 mb-6 text-transparent bg-clip-text bg-gradient-to-r {{ $program['color'] }}"></i>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ $program['title'] }}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ $program['description'] }}</p>
                    <a href="#" class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                        Learn more <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>
                    </a>
                </div>
            @endforeach
        </div>
    </div>
</section>