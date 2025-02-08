<div class="relative min-h-[calc(100vh-64px)] bg-white dark:bg-gray-900 flex items-center py-8">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10"></div>

    <!-- Hero Content -->
    <div class="relative w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <!-- Left side content -->
                <div class="flex-1 w-full space-y-10 text-center lg:text-left">
                    <!-- Modern floating badge -->
                    <div class="inline-flex items-center px-4 py-2.5 rounded-2xl
                        bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20
                        backdrop-blur-xl shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20
                        border border-blue-100/20 dark:border-blue-500/20
                        text-blue-600 dark:text-blue-400 font-medium">
                        <div class="flex items-center gap-2 text-sm">
                            <span class="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            ACM Task Force
                        </div>
                    </div>

                    <!-- Main content -->
                    <div class="relative space-y-8">
                        <div class="absolute -left-4 top-0 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl -z-10"></div>

                        <div class="space-y-4">
                            <h2 class="text-lg sm:text-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                                Start your journey with DIU ACM
                            </h2>
                            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Where Programmers <br class="hidden sm:block"/>
                                <span class="relative">
                                    Become Gladiators
                                    <span class="absolute -bottom-2 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-full transform scale-x-0 animate-[expand_0.5s_ease-in-out_forwards] origin-left"></span>
                                </span>
                            </h1>
                        </div>

                        <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            We organize workshops, classes, contests, and many more.
                        </p>

                        <!-- Buttons -->
                        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                            <button class="w-full sm:w-auto px-8 py-4 bg-blue-600
                                text-white rounded-2xl font-medium
                                flex items-center justify-center gap-2 group
                                transition-all duration-300
                                hover:bg-blue-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
                                See Leaderboard
                                <i data-lucide="arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1"></i>
                            </button>
                            <a href="{{ route('events') }}" class="w-full sm:w-auto px-8 py-4
                                text-gray-900 dark:text-white rounded-2xl font-medium
                                flex items-center justify-center gap-2 group
                                transition-all duration-300
                                bg-gray-100 dark:bg-gray-800
                                hover:bg-gray-200 dark:hover:bg-gray-700
                                hover:scale-105">
                                Participate Events
                                <i data-lucide="chevron-right" class="w-5 h-5 transition-transform group-hover:translate-x-1"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Right Side - Code Editor -->
                @include('partials.code-editor')
            </div>
        </div>
    </div>
</div>