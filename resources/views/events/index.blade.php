<x-web-layout>
    <section class="relative py-20 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Events
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-400">
                    Browse and search through our events
                </p>
            </div>
        </div>
    </section>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <livewire:events.event-list/>
    </div>

</x-web-layout>
