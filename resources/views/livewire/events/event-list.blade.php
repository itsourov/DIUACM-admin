<div class="container mx-auto px-4 py-6 ">
    <!-- Search Bar -->
    <div class="relative mb-8">
        <div class="relative group">
            <input
                wire:model.live="search"
                type="text"
                placeholder="Search events by title, type or scope..."
                class="w-full px-6 py-4 pl-14 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-200 dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            >
            <svg class="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    </div>
    <!-- Events List -->
    <div class="space-y-4">
        @forelse($events as $event)
            @php
                [$status, $color] = $this->getEventStatus($event->starting_at, $event->ending_at);
                $duration = Carbon\Carbon::parse($event->starting_at)->diffForHumans($event->ending_at, true);
            @endphp

            <a href="{{ route('events.show', $event) }}"
               class="block group transition-all duration-200 hover:scale-[1.01]">
                <div class="p-6 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <!-- Event Info -->
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {{ $event->title }}
                                </h3>
                                <span class="px-3 py-1 text-xs font-medium rounded-full capitalize
                                    @if($status === 'upcoming') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200
                                    @elseif($status === 'running') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200
                                    @else bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300
                                    @endif">
                                    {{ $status }}
                                </span>
                            </div>

                            <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                                <div class="flex items-center gap-2">
                                    <x-icon name="{{ $event->type->getIcon() }}" class="w-4 h-4" />
                                    <span class="px-2 py-1 rounded-md text-xs font-medium" style="background-color: {{ $event->type->getColor() }}20; color: {{ $event->type->getColor() }}">
                                        {{ $event->type->getLabel() }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <x-icon name="{{ $event->attendance_scope->getIcon() }}" class="w-4 h-4" />
                                    <span class="px-2 py-1 rounded-md text-xs font-medium" style="background-color: {{ $event->attendance_scope->getColor() }}20; color: {{ $event->attendance_scope->getColor() }}">
                                        {{ $event->attendance_scope->getLabel() }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ Carbon\Carbon::parse($event->starting_at)->format('M d, Y h:i A') }}
                                </div>
                                <div class="flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ $duration }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        @empty
            <div class="text-center py-16 px-4">
                <div class="max-w-md mx-auto">
                    <div class="relative">
                        <svg class="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center opacity-50">
                            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No events found</h3>
                    @if($search)
                        <p class="text-gray-500 dark:text-gray-400">No events match your search "<span class="font-medium">{{ $search }}</span>". Try searching with different keywords.</p>
                    @else
                        <p class="text-gray-500 dark:text-gray-400">There are no events scheduled at the moment.<br>Please check back later for upcoming events.</p>
                    @endif
                </div>
            </div>
        @endforelse

        <!-- Pagination -->
        <div class="mt-6">
            {{ $events->links() }}
        </div>
    </div>
</div>
