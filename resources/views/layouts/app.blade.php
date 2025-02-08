<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DIU ACM</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Custom Styles -->
    <style>
        @keyframes expand {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
        
        @keyframes ambient-pulse {
            0% { opacity: 0.2; }
            50% { opacity: 0.4; }
            100% { opacity: 0.2; }
        }
        
        .animate-ambient-pulse {
            animation: ambient-pulse 4s ease-in-out infinite;
        }
    </style>
</head>
<body class="min-h-screen bg-white dark:bg-gray-900 font-sans">
    @yield('content')
    
    <script>
        // Initialize Lucide Icons
        lucide.createIcons();
    </script>
</body>
</html>