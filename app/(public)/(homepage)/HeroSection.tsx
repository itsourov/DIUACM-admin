// components/HeroSection.tsx
import {ArrowRight, ChevronRight, Code2, Terminal} from 'lucide-react';
import Link from "next/link";

const HeroSection = () => {
    const currentTime = "2025-01-31 15:55:49";
    const currentUser = "itsourov";

    return (
        <div className="relative min-h-[calc(100vh-64px)] bg-white dark:bg-gray-900 flex items-center py-8">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10"/>

            {/* Hero Content */}
            <div className="relative w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left side content */}
                        <div className="flex-1 w-full space-y-10 text-center lg:text-left">
                            {/* Modern floating badge */}
                            <div className="inline-flex items-center px-4 py-2.5 rounded-2xl
                                bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20
                                backdrop-blur-xl shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20
                                border border-blue-100/20 dark:border-blue-500/20
                                text-blue-600 dark:text-blue-400 font-medium">
                                <div className="flex items-center gap-2 text-sm">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    ACM Task Force
                                </div>
                            </div>

                            {/* Main content with modern spacing and gradient accent */}
                            <div className="relative space-y-8">
                                {/* Decorative element */}
                                <div
                                    className="absolute -left-4 top-0 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl -z-10"></div>

                                <div className="space-y-4">
                                    <h2 className="text-lg sm:text-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                                        Start your journey with DIU ACM
                                    </h2>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Where Programmers <br className="hidden sm:block"/>
                                        <span className="relative">
                                            Become Gladiators
                                            <span
                                                className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-full transform scale-x-0 animate-[expand_0.5s_ease-in-out_forwards] origin-left"></span>
                                        </span>
                                    </h1>
                                </div>

                                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                    We organize workshops, classes, contests, and many more.
                                </p>

                                {/* Modern buttons with hover effects */}
                                <div
                                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-blue-600
                                        text-white rounded-2xl font-medium
                                        flex items-center justify-center gap-2 group
                                        transition-all duration-300
                                        hover:bg-blue-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
                                        See Leaderboard
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1"/>
                                    </button>
                                    <Link href='/events' className="w-full sm:w-auto px-8 py-4
                                        text-gray-900 dark:text-white rounded-2xl font-medium
                                        flex items-center justify-center gap-2 group
                                        transition-all duration-300
                                        bg-gray-100 dark:bg-gray-800
                                        hover:bg-gray-200 dark:hover:bg-gray-700
                                        hover:scale-105">
                                        Participate Events
                                        <ChevronRight
                                            className="w-5 h-5 transition-transform group-hover:translate-x-1"/>
                                    </Link>
                                </div>


                            </div>
                        </div>

                        {/* Right Side - Code Editor with ambient effect */}
                        <div className="flex-1 min-w-0 lg:max-w-[640px] relative group">
                            {/* Ambient light effect */}
                            <div
                                className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-2xl opacity-20 dark:opacity-40 animate-ambient-pulse"></div>

                            {/* Additional ambient highlights */}
                            <div
                                className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Animated corner accents */}
                            <div
                                className="absolute -top-2 -left-2 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
                            <div
                                className="absolute -bottom-2 -right-2 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>

                            {/* Code editor with glass effect */}
                            <div
                                className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-900/95 backdrop-blur-sm border border-gray-800/50">
                                {/* Editor top bar */}
                                <div
                                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-900/90 border-b border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"/>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                                        <div className="w-3 h-3 rounded-full bg-green-500"/>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                                        <Code2 className="w-4 h-4"/>
                                        main.cpp
                                    </div>
                                </div>

                                {/* Code content */}
                                <div className="p-3 sm:p-4 space-y-4 overflow-x-auto text-white">
                                    <pre className="text-xs sm:text-sm font-mono leading-6">
                                        <code>{`#include `}<span className="text-gray-300">{`<`}</span><span
                                            className="text-emerald-400">{`bits/stdc++.h`}</span><span
                                            className="text-gray-300">{`>`}</span>{`
using namespace std;
`}<span className="text-fuchsia-400">{`#define`}</span>{` ll long long
`}{`
`}<span className="text-sky-400">{`int`}</span><span className="text-yellow-300">{` main`}</span><span
                                            className="text-gray-300">{`() {`}</span>{`
    ios_base::`}<span className="text-yellow-300">{`sync_with_stdio`}</span>{`(`}<span
                                            className="text-amber-300">{`0`}</span>{`);
    cin.`}<span className="text-yellow-300">{`tie`}</span>{`(`}<span className="text-amber-300">{`0`}</span>{`);

    cout << `}<span className="text-amber-300">{`"Welcome to our Website"`}</span>{` << endl;
}`}</code>
                                    </pre>

                                    {/* File info */}
                                    <div
                                        className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
                                            <span className="hidden sm:inline">{currentTime}</span>
                                            <span className="sm:hidden">{currentTime.split(' ')[1]}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Terminal className="w-3 h-3"/>
                                            @{currentUser}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;