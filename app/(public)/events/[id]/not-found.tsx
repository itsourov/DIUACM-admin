// app/events/[id]/not-found.tsx
import Link from 'next/link';
import { CalendarX } from 'lucide-react';

export default function EventNotFound() {
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
                        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
                            <CalendarX className="w-12 h-12 text-red-500 dark:text-red-400" />
                        </div>
                        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                            Event Not Found
                        </h1>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                            The event you&apos;re looking for doesn&apos;t exist or has been removed.
                        </p>
                        <Link
                            href="/events"
                            className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent
                                     text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
                                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                     dark:focus:ring-offset-gray-900 transition-colors"
                        >
                            View All Events
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}