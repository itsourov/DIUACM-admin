<div class="flex-1 min-w-0 lg:max-w-[640px] relative group">
    <!-- Ambient light effect -->
    <div
        class="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-2xl opacity-20 dark:opacity-40 animate-ambient-pulse"></div>

    <!-- Additional ambient highlights -->
    <div
        class="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>

    <!-- Animated corner accents -->
    <div class="absolute -top-2 -left-2 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
    <div class="absolute -bottom-2 -right-2 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>

    <!-- Code editor -->
    <div
        class="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900/95 backdrop-blur-sm border border-gray-800/50">
        <!-- Editor top bar -->
        <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-900/90 border-b border-gray-800">
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <i data-lucide="code-2" class="w-4 h-4"></i>
                main.cpp
            </div>
        </div>

        <!-- Code content -->
        <div class="p-3 sm:p-4 space-y-4 overflow-x-auto text-white">
            <pre class="text-xs sm:text-sm font-mono leading-6"><code>#include <span
                        class="text-gray-300">&lt;</span><span class="text-emerald-400">bits/stdc++.h</span><span
                        class="text-gray-300">&gt;</span>
using namespace std;
<span class="text-fuchsia-400">#define</span> ll long long

<span class="text-sky-400">int</span><span class="text-yellow-300"> main</span><span class="text-gray-300">() {</span>
    ios_base::<span class="text-yellow-300">sync_with_stdio</span>(<span class="text-amber-300">0</span>);
    cin.<span class="text-yellow-300">tie</span>(<span class="text-amber-300">0</span>);

    cout << <span class="text-amber-300">"Welcome to our Website"</span> << endl;
}</code></pre>

            <!-- File info -->
            <div class="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="hidden sm:inline">{{ now()->format('Y-m-d H:i:s') }}</span>
                    <span class="sm:hidden">{{ now()->format('H:i:s') }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i data-lucide="terminal" class="w-3 h-3"></i>
                    @<span>{{ $currentUser }}</span>
                </div>
            </div>
        </div>
    </div>
</div>
