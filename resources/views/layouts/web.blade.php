<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Document</title>

    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite('resources/css/app.css')
    @else
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    @endif
    <script src="https://unpkg.com/lucide@latest"></script>
    @filamentStyles
    <!-- Dark mode script -->
    <script>
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        function toggleDarkMode() {
            if (localStorage.theme === 'dark') {
                localStorage.theme = 'light';
                document.documentElement.classList.remove('dark');
            } else {
                localStorage.theme = 'dark';
                document.documentElement.classList.add('dark');
            }
        }
    </script>
</head>
<body class="min-h-screen bg-white dark:bg-gray-900 font-sans">
@include('layouts.navbar')
<main class="pt-16">
    {{ $slot }}
</main>


@vite('resources/js/app.js')
@livewire('notifications')
@filamentScripts
<script>
    // Initialize Lucide Icons
    lucide.createIcons();
</script>
</body>
</html>
