@php
    $navLinks = [
        [
            'name' => 'Home',
            'route' => 'home',
            'icon' => 'home'
        ],
        [
            'name' => 'Events',
            'route' => 'events.index',
            'icon' => 'calendar'
        ],
        [
            'name' => 'Trackers',
            'route' => 'trackers',
            'icon' => 'calendar'
        ],
        [
            'name' => 'Blog',
            'route' => 'blog',
            'icon' => 'book-open'
        ],
        [
            'name' => 'Gallery',
            'route' => 'gallery',
            'icon' => 'image'
        ],
    ];
@endphp

<nav
    class="fixed w-full z-50 top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-150">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <a href="{{ route('home') }}" class="flex items-center space-x-2 hover:opacity-90 transition-opacity">
                <i data-lucide="terminal" class="h-6 w-6 text-blue-600 dark:text-blue-500"></i>
                <span class="text-xl font-bold text-blue-600 dark:text-blue-500">
                    {{ config('app.name', 'Laravel') }}
                </span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-1">
                @foreach($navLinks as $link)
                    <a href="{{ route($link['route']) }}"
                       class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                          transition-colors duration-150 ease-in-out
                          {{ request()->routeIs($link['route'])
                             ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                             : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }}">
                        <i data-lucide="{{ $link['icon'] }}" class="h-4 w-4"></i>
                        <span>{{ $link['name'] }}</span>
                    </a>
                @endforeach
            </div>

            <!-- Desktop Right Section -->
            <div class="hidden md:flex items-center space-x-4">
                <!-- Dark Mode Toggle -->
                <button onclick="toggleDarkMode()"
                        class="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle theme">
                    <i data-lucide="sun" class="h-5 w-5 hidden dark:block"></i>
                    <i data-lucide="moon" class="h-5 w-5 block dark:hidden"></i>
                </button>

                @guest
                    <a href="{{ route('login') }}"
                       class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-150 text-sm font-medium">
                        Sign In
                    </a>
                @else
                    <div x-data="{ open: false }" @click.away="open = false" class="relative">
                        <button @click="open = !open"
                                id="user-button"
                                class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            @if(Auth::user()->avatar)
                                <img src="{{ Auth::user()->avatar }}"
                                     alt="{{ Auth::user()->name }}"
                                     class="h-7 w-7 rounded-full">
                            @else
                                <div
                                    class="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                    {{ substr(Auth::user()->name, 0, 1) }}
                                </div>
                            @endif
                        </button>

                        <div x-cloak x-show="open"
                             x-transition
                             class="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-900 rounded-md shadow-lg
                                    border border-gray-200 dark:border-gray-700 z-50">
                            <a href="/"
                               class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                                      hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
                                <i data-lucide="user" class="h-4 w-4"></i>
                                <span>Profile</span>
                            </a>
                            <form method="POST" action="/">
                                @csrf
                                <button type="submit"
                                        class="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400
                                               hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150">
                                    <i data-lucide="log-out" class="h-4 w-4"></i>
                                    <span>Sign out</span>
                                </button>
                            </form>
                        </div>
                    </div>
                @endguest
            </div>

            <!-- Mobile Menu Button -->
            <button x-data @click="$dispatch('open-mobile-menu')"
                    class="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Open menu">
                <i data-lucide="menu" class="h-6 w-6"></i>
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div x-data="{ open: false }"
         x-cloak x-show="open"
         @open-mobile-menu.window="open = true"
         @click.away="open = false"
         x-transition
         class="md:hidden">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>

        <!-- Menu -->
        <div class="fixed top-0 right-0 w-[280px] h-full bg-white dark:bg-gray-900 z-50 transform
                    transition-transform duration-200 ease-in-out overflow-y-auto">
            <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                <button @click="open = false"
                        class="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <i data-lucide="x" class="h-5 w-5"></i>
                </button>
            </div>

            @auth
                <div class="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div class="flex items-center space-x-3">
                        @if(Auth::user()->avatar)
                            <img src="{{ Auth::user()->avatar }}"
                                 alt="{{ Auth::user()->name }}"
                                 class="h-10 w-10 rounded-full">
                        @else
                            <div
                                class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                {{ substr(Auth::user()->name, 0, 1) }}
                            </div>
                        @endif
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {{ Auth::user()->name }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {{ Auth::user()->email }}
                            </p>
                        </div>
                    </div>
                </div>
            @endauth

            <div class="px-2 py-3">
                @foreach($navLinks as $link)
                    <a href="{{ route($link['route']) }}"
                       class="flex items-center space-x-2 px-3 py-2 rounded-md mb-1
                              {{ request()->routeIs($link['route'])
                                 ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                 : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }}">
                        <i data-lucide="{{ $link['icon'] }}" class="h-5 w-5"></i>
                        <span>{{ $link['name'] }}</span>
                    </a>
                @endforeach

                @auth
                    <a href="/"
                       class="flex items-center space-x-2 px-3 py-2 rounded-md mb-1
                              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <i data-lucide="user" class="h-5 w-5"></i>
                        <span>Profile</span>
                    </a>
                    <form method="POST" action="/">
                        @csrf
                        <button type="submit"
                                class="flex items-center space-x-2 w-full px-3 py-2 rounded-md mb-1
                                       text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <i data-lucide="log-out" class="h-5 w-5"></i>
                            <span>Sign out</span>
                        </button>
                    </form>
                @endauth
            </div>

            <div class="p-4 border-t border-gray-200 dark:border-gray-800">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                    <button onclick="toggleDarkMode()"
                            class="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle theme">
                        <i data-lucide="sun" class="h-5 w-5 hidden dark:block"></i>
                        <i data-lucide="moon" class="h-5 w-5 block dark:hidden"></i>
                    </button>
                </div>

                @guest
                    <a href="{{ route('login') }}"
                       class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md
                              transition-colors duration-150 flex items-center justify-center text-sm font-medium">
                        Sign In
                    </a>
                @endguest
            </div>
        </div>
    </div>
</nav>
