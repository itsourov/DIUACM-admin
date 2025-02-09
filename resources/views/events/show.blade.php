<x-web-layout>
    <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <!-- Event Header -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-6 mb-6">
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div class="space-y-4">
                        <!-- Status Badge -->
                        <div class="flex flex-wrap gap-2">
                            @php
                                $now = \Carbon\Carbon::parse('2025-02-09 08:15:09');
                                $status = $now->between($event->starting_at, $event->ending_at)
                                    ? 'running'
                                    : ($now->lt($event->starting_at) ? 'upcoming' : 'ended');
                            @endphp
                            <span @class([
                                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' => $status === 'running',
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' => $status === 'upcoming',
                                'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200' => $status === 'ended',
                            ])>
                                <span class="w-2 h-2 mr-2 rounded-full @if($status === 'running') bg-green-600 @elseif($status === 'upcoming') bg-blue-600 @else bg-gray-600 @endif"></span>
                                {{ ucfirst($status) }}
                            </span>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                                {{ $event->type->getLabel() }}
                            </span>
                        </div>

                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {{ $event->title }}
                        </h1>

                        <!-- Date and Time -->
                        <div class="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300 text-sm">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span>{{ $event->starting_at->format('F j, Y') }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span>{{ $event->starting_at->format('h:i A') }} - {{ $event->ending_at->format('h:i A') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    @if($event->open_for_attendance && $status === 'running' && !$event->solveStats->where('user_id', auth()->id())->first()?->is_present)
                        <a href="/"
                           class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-150">
                            Give Attendance
                        </a>
                    @endif
                </div>
            </div>

            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Description -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-6">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">About This Event</h2>
                        <div class="prose dark:prose-invert max-w-none">
                            {!! $event->description ?? 'No description provided.' !!}
                        </div>
                    </div>

                    <!-- Attendees and Stats -->
                    <div x-data="{ activeTab: 'attendees' }" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-6">
                        <!-- Tab Navigation -->
                        <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
                            <div class="flex space-x-6">
                                <button @click="activeTab = 'attendees'"
                                    :class="{ 'border-blue-500 text-blue-600 dark:text-blue-400': activeTab === 'attendees',
                                             'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300': activeTab !== 'attendees' }"
                                    class="pb-4 border-b-2 font-medium text-sm">
                                    Attendees
                                    <span class="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                                        {{ $event->attendances->count() }}
                                    </span>
                                </button>
                                <button @click="activeTab = 'statistics'"
                                    :class="{ 'border-blue-500 text-blue-600 dark:text-blue-400': activeTab === 'statistics',
                                             'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300': activeTab !== 'statistics' }"
                                    class="pb-4 border-b-2 font-medium text-sm">
                                    Solve Statistics
                                </button>
                            </div>
                        </div>

                        <!-- Attendees Tab -->
                        <div x-show="activeTab === 'attendees'">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="text-left border-b border-gray-200 dark:border-gray-700">
                                            <th class="pb-3 font-medium text-gray-500 dark:text-gray-400">User</th>
                                            <th class="pb-3 font-medium text-gray-500 dark:text-gray-400">Attendance Time</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                                        @foreach($event->users as $attendanceUser)

                                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td class="py-3">
                                                    <div class="flex items-center gap-3">
                                                        <img src="{{ $attendanceUser->profile_photo_url }}"
                                                             alt="{{ $attendanceUser->name }}"
                                                             class="h-8 w-8 rounded-full">
                                                        <div>
                                                            <div class="font-medium text-gray-900 dark:text-white">
                                                                {{ $attendanceUser->name }}
                                                            </div>
                                                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                                                {{ '@' . $attendanceUser->username }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="py-3">
                                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                                        {{ $attendanceUser->pivot->created_at?->format('M j, Y g:i A') }}
                                                    </span>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Statistics Tab -->
                        <div x-show="activeTab === 'statistics'">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="text-left border-b border-gray-200 dark:border-gray-700">
                                            <th class="pb-3 font-medium text-gray-500 dark:text-gray-400">User</th>
                                            <th class="pb-3 font-medium text-gray-500 dark:text-gray-400">Solve Count</th>
                                            <th class="pb-3 font-medium text-gray-500 dark:text-gray-400">Upsolve Count</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                                        @foreach($event->solveStats->load('user') as $stat)
                                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td class="py-3">
                                                    <div class="flex items-center gap-3">
                                                        <img src="{{ $stat->user->profile_photo_url }}"
                                                             alt="{{ $stat->user->name }}"
                                                             class="h-8 w-8 rounded-full">
                                                        <div>
                                                            <div class="font-medium text-gray-900 dark:text-white">
                                                                {{ $stat->user->name }}
                                                            </div>
                                                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                                                {{ '@' . $stat->user->username }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="py-3">
                                                    <span class="font-medium text-gray-900 dark:text-white">
                                                        {{ $stat->solve_count }}
                                                    </span>
                                                </td>
                                                <td class="py-3">
                                                    <span class="font-medium text-gray-900 dark:text-white">
                                                        {{ $stat->upsolve_count }}
                                                    </span>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                    <!-- Event Details -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-6">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Details</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                                <p class="mt-1 text-gray-900 dark:text-white">{{ $event->type->getLabel() }}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance
                                    Scope</label>
                                <p class="mt-1 text-gray-900 dark:text-white">{{ $event->attendance_scope->getLabel() }}</p>
                            </div>

                            <div>
                                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Event
                                    Link</label>
                                <div class="mt-1 flex gap-2">
                                    <input type="text"
                                           value="{{ $event->event_link }}"
                                           class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                           readonly>
                                    <button onclick="navigator.clipboard.writeText('{{ $event->event_link }}')"
                                            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-150">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</x-web-layout>
