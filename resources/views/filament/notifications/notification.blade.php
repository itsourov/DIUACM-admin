@php
    use Filament\Notifications\Livewire\Notifications;
    use Filament\Support\Enums\Alignment;
    use Filament\Support\Enums\VerticalAlignment;
    use Illuminate\Support\Arr;

    $color = $getColor() ?? 'gray';
    $isInline = $isInline();
    $status = $getStatus();
    $title = $getTitle();
    $hasTitle = filled($title);
    $date = $getDate();
    $hasDate = filled($date);
    $body = $getBody();
    $hasBody = filled($body);
    $duration = $notification->getDuration();
@endphp

<x-filament-notifications::notification
    :notification="$notification"
    :x-transition:enter-start="
        Arr::toCssClasses([
            'translate-y-2 opacity-0',
        ])
    "
    :x-transition:enter-end="'translate-y-0 opacity-100'"
    :x-transition:leave-start="'opacity-100'"
    :x-transition:leave-end="'opacity-0'"
    x-transition:enter="transform ease-out duration-300"
    x-transition:leave="transition ease-in duration-200"
    @class([
        'w-96 max-w-full border-l-4 rounded shadow-lg overflow-hidden',
        match ($status) {
            'success' => 'bg-green-50 border-green-400',
            'danger', 'error' => 'bg-red-50 border-red-400',
            'warning' => 'bg-yellow-50 border-yellow-400',
            'info' => 'bg-blue-50 border-blue-400',
            default => 'bg-gray-50 border-gray-400',
        },
    ])
>
    <div class="p-4">
        <div class="flex items-start">
            <!-- Icons -->
            <div class="flex-shrink-0">
                @if($status === 'success')
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                @elseif($status === 'danger' || $status === 'error')
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                @elseif($status === 'warning')
                    <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                @else
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                @endif
            </div>

            <!-- Content -->
            <div class="ml-3 w-0 flex-1">
                @if ($hasTitle)
                    <h3 class="text-sm font-medium {{ match ($status) {
                        'success' => 'text-green-800',
                        'danger', 'error' => 'text-red-800',
                        'warning' => 'text-yellow-800',
                        'info' => 'text-blue-800',
                        default => 'text-gray-800',
                    } }}">
                        {{ str($title)->sanitizeHtml()->toHtmlString() }}
                    </h3>
                @endif

                @if ($hasBody)
                    <p class="mt-1 text-sm {{ match ($status) {
                        'success' => 'text-green-700',
                        'danger', 'error' => 'text-red-700',
                        'warning' => 'text-yellow-700',
                        'info' => 'text-blue-700',
                        default => 'text-gray-700',
                    } }}">
                        {{ str($body)->sanitizeHtml()->toHtmlString() }}
                    </p>
                @endif

                @if ($hasDate)
                    <p class="mt-1 text-sm {{ match ($status) {
                        'success' => 'text-green-700',
                        'danger', 'error' => 'text-red-700',
                        'warning' => 'text-yellow-700',
                        'info' => 'text-blue-700',
                        default => 'text-gray-700',
                    } }}">
                        {{ $date }}
                    </p>
                @endif

                @if ($actions = $getActions())
                    <x-filament-notifications::actions
                        :actions="$actions"
                        @class(['mt-3'])
                    />
                @endif
            </div>

            <!-- Close Button -->
            <div class="ml-4 flex-shrink-0 flex">
                <button
                    x-on:click="close"
                    class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                    <span class="sr-only">Close</span>
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Progress Bar -->
        @if($duration)
            <div
                x-data="{
                    progress: 100,
                    init() {
                        const duration = {{ $duration }};
                        const interval = setInterval(() => {
                            this.progress = Math.max(0, this.progress - (100 / (duration / 100)));
                            if (this.progress <= 0) clearInterval(interval);
                        }, 100);
                    }
                }"
                class="h-1 mt-3 relative max-w-full overflow-hidden rounded-full {{ match ($status) {
                    'success' => 'bg-green-100',
                    'danger', 'error' => 'bg-red-100',
                    'warning' => 'bg-yellow-100',
                    'info' => 'bg-blue-100',
                    default => 'bg-gray-100',
                } }}"
            >
                <div
                    class="h-full transition-all duration-75 {{ match ($status) {
                        'success' => 'bg-green-400',
                        'danger', 'error' => 'bg-red-400',
                        'warning' => 'bg-yellow-400',
                        'info' => 'bg-blue-400',
                        default => 'bg-gray-400',
                    } }}"
                    x-bind:style="'width: ' + progress + '%'"
                ></div>
            </div>
        @endif
    </div>
</x-filament-notifications::notification>
