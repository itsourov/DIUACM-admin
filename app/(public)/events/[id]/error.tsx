// app/events/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function EventError({
                                       error,
                                       reset,
                                   }: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/events"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700
                             dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                    <svg
                        className="mr-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Events
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                              shadow-sm p-8 text-center">
                    <div className="mx-auto flex max-w-md flex-col items-center justify-center">
                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-4">
                            <AlertTriangle className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
                        </div>
                        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                            Something went wrong
                        </h1>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                            An error occurred while loading the event. Please try again later.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={reset}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent
                                         text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                         dark:focus:ring-offset-gray-900 transition-colors"
                            >
                                Try again
                            </button>
                            <Link
                                href="/events"
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300
                                         dark:border-gray-600 text-sm font-medium rounded-md text-gray-700
                                         dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50
                                         dark:hover:bg-gray-700 focus:outline-none focus:ring-2
                                         focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900
                                         transition-colors"
                            >
                                View All Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}