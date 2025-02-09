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
                                $now = now();
                                $status = $now->between($event->starting_at, $event->ending_at)
                                    ? 'running'
                                    : ($now->lt($event->starting_at) ? 'upcoming' : 'ended');
                                $hasAttendance = $event->users->contains(auth()->id());
                            @endphp
                            <div class="flex gap-2 flex-wrap">
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
                                @if($hasAttendance)
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Attendance Recorded
                                    </span>
                                @endif
                            </div>
                        </div>

                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {{ $event->title }}
                        </h1>

                        <!-- Date and Time -->
                        <div class="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300 text-sm">
                            <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span>{{ $event->starting_at->format('F j, Y') }}</span>
                            </div>
                            <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
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
                    <div class="flex gap-2">
                        @if($event->open_for_attendance)
                            @if($status === 'running' && !$hasAttendance)
                                <div x-data="{ open: false }">
                                    <button @click="open = true"
                                            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-150 shadow-sm hover:shadow">
                                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        </svg>
                                        Give Attendance
                                    </button>

                                    <!-- Modal -->
                                    <div x-cloak x-show="open"
                                         x-trap.noscroll="open"
                                         class="fixed inset-0 z-50 overflow-y-auto"
                                         x-transition:enter="transition ease-out duration-300"
                                         x-transition:enter-start="opacity-0"
                                         x-transition:enter-end="opacity-100"
                                         x-transition:leave="transition ease-in duration-200"
                                         x-transition:leave-start="opacity-100"
                                         x-transition:leave-end="opacity-0">
                                        <!-- Overlay -->
                                        <div @click="open = false"
                                             class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80"></div>

                                        <!-- Modal panel -->
                                        <div class="relative min-h-screen flex items-center justify-center p-4">
                                            <div x-show="open"
                                                 x-transition:enter="transition ease-out duration-300"
                                                 x-transition:enter-start="opacity-0 translate-y-4"
                                                 x-transition:enter-end="opacity-100 translate-y-0"
                                                 x-transition:leave="transition ease-in duration-200"
                                                 x-transition:leave-start="opacity-100 translate-y-0"
                                                 x-transition:leave-end="opacity-0 translate-y-4"
                                                 @click.outside="open = false"
                                                 class="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl">
                                                <!-- Modal content -->
                                                <div class="flex flex-col items-center">
                                                    <div class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 mb-6">
                                                        <svg class="h-6 w-6 text-blue-600 dark:text-blue-400"
                                                             fill="none" viewBox="0 0 24 24" stroke-width="2"
                                                             stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                                                        </svg>
                                                    </div>
                                                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                        Event Attendance
                                                    </h3>
                                                    <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                                                        Please enter the event password to mark your attendance
                                                    </p>

                                                    <form action="{{route('events.attendance',$event)}}" method="POST"
                                                          class="w-full">
                                                        @csrf
                                                        <div class="mb-6">
                                                            <input type="text"
                                                                   name="event_password"
                                                                   id="event_password"
                                                                   placeholder="Enter event password"
                                                                   required
                                                                   class="block w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                                                   autofocus>
                                                        </div>
                                                        <div class="flex gap-3">
                                                            <button type="submit"
                                                                    class="flex-1 inline-flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800">
                                                                Submit Attendance
                                                            </button>
                                                            <button type="button"
                                                                    @click="open = false"
                                                                    class="flex-1 inline-flex justify-center items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @elseif($status === 'upcoming')
                                <div class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl">
                                    <span class="flex items-center">
                                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        Attendance will open when event starts
                                    </span>
                                </div>
                            @endif
                        @endif
                    </div>
                </div>

                <!-- Countdown Timer for Upcoming/Running Events -->
                @if($status === 'upcoming' || $status === 'running')
                    <div x-data="countdown('{{ $status === 'upcoming' ? $event->starting_at : $event->ending_at }}')"
                         class="mt-6 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-sm">
                        <h3 class="text-center text-blue-600 dark:text-blue-400 font-medium mb-4">
                            {{ $status === 'upcoming' ? 'Event Starts In' : 'Event Ends In' }}
                        </h3>
                        <div class="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-6">
                            <div class="text-center bg-white dark:bg-gray-800 px-2 sm:px-4 py-3 rounded-xl shadow-sm">
                                <span x-text="days"
                                      class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"></span>
                                <p class="text-xs uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70 mt-1">
                                    Days</p>
                            </div>
                            <div class="text-center bg-white dark:bg-gray-800 px-2 sm:px-4 py-3 rounded-xl shadow-sm">
                                <span x-text="hours"
                                      class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"></span>
                                <p class="text-xs uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70 mt-1">
                                    Hours</p>
                            </div>
                            <div class="text-center bg-white dark:bg-gray-800 px-2 sm:px-4 py-3 rounded-xl shadow-sm">
                                <span x-text="minutes"
                                      class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"></span>
                                <p class="text-xs uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70 mt-1">
                                    Minutes</p>
                            </div>
                            <div class="text-center bg-white dark:bg-gray-800 px-2 sm:px-4 py-3 rounded-xl shadow-sm">
                                <span x-text="seconds"
                                      class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"></span>
                                <p class="text-xs uppercase tracking-wider text-blue-600/70 dark:text-blue-400/70 mt-1">
                                    Seconds</p>
                            </div>
                        </div>
                    </div>
                @endif
            </div>

            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Column -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Description -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-6">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            About This Event
                        </h2>
                        <div class="prose dark:prose-invert max-w-none">
                            {!! $event->description ?? '<p class="text-gray-500 dark:text-gray-400 italic">No description provided.</p>' !!}
                        </div>
                    </div>

                    <!-- Attendees and Stats -->
                    <div x-data="{ activeTab: 'attendees' }"
                         class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-6">
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
                        <div x-show="activeTab === 'attendees'" x-transition>
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                    <tr class="text-left border-b border-gray-200 dark:border-gray-700">
                                        <th class="pb-3 font-medium text-gray-500 dark:text-gray-400">User</th>
                                        <th class="pb-3 font-medium text-gray-500 dark:text-gray-400">Attendance Time
                                        </th>
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
                        <div x-show="activeTab === 'statistics'" x-transition>
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
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                            </svg>
                            Event Details
                        </h2>
                        <div class="space-y-4">
                            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                                <p class="mt-1 text-gray-900 dark:text-white font-medium">{{ $event->type->getLabel() }}</p>
                            </div>
                            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance
                                    Scope</label>
                                <p class="mt-1 text-gray-900 dark:text-white font-medium">{{ $event->attendance_scope->getLabel() }}</p>
                            </div>

                            @if($event->open_for_attendance)
                                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance
                                        Window</label>
                                    @if($status === 'upcoming')
                                        <p class="mt-1 text-blue-600 dark:text-blue-400 font-medium">
                                            Opens at {{ $event->starting_at->format('h:i A') }}
                                        </p>
                                    @elseif($status === 'running')
                                        @if(!$hasAttendance)
                                            <p class="mt-1 text-green-600 dark:text-green-400 font-medium">
                                                Open now until {{ $event->ending_at->format('h:i A') }}
                                            </p>
                                        @else
                                            <p class="mt-1 text-green-600 dark:text-green-400 font-medium flex items-center">
                                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          stroke-width="2" d="M5 13l4 4L19 7"/>
                                                </svg>
                                                Attendance recorded
                                            </p>
                                        @endif
                                    @elseif($status === 'ended')
                                        <p class="mt-1 text-gray-600 dark:text-gray-400 font-medium">
                                            Closed at {{ $event->ending_at->format('h:i A') }}
                                        </p>
                                    @endif
                                </div>
                            @endif

                            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Event Link</label>
                                <div class="mt-2 flex gap-2">
                                    <input type="text"
                                           value="{{ $event->event_link }}"
                                           class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                                           readonly>
                                    <button onclick="navigator.clipboard.writeText('{{ $event->event_link }}')"
                                            class="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-700/50 dark:hover:bg-blue-600/50 text-blue-700 dark:text-blue-200 rounded-lg transition-colors duration-150 group">
                                        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Related/Upcoming Events -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 p-6">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
                        <div class="space-y-4">
                            @foreach($upcomingEvents as $upcomingEvent)
                                <a href="{{ route('events.show', $upcomingEvent) }}"
                                   class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition">
                                    <h3 class="font-medium text-gray-900 dark:text-white">{{ $upcomingEvent->title }}</h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {{ $upcomingEvent->starting_at->format('F j, Y') }}
                                    </p>
                                </a>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Alpine.js Countdown Script -->
    <script>
        function countdown(date) {
            return {
                days: '00',
                hours: '00',
                minutes: '00',
                seconds: '00',
                init() {
                    setInterval(() => {
                        const target = new Date(date).getTime();
                        const now = new Date().getTime();
                        const difference = target - now;

                        this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
                        this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                        this.seconds = Math.floor((difference % (1000 * 60)) / 1000);

                        this.days = this.days < 10 ? '0' + this.days : this.days;
                        this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
                        this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
                        this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
                    }, 1000);
                }
            }
        }
    </script>
</x-web-layout>
