// app/events/[id]/loading.tsx
import { CalendarClock, Users, Link as LinkIcon, Key } from 'lucide-react';

export default function LoadingEventPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Back Button Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="inline-flex items-center">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                              shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                        {/* Header Skeleton */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                            <div className="space-y-4 w-full">
                                {/* Title Skeleton */}
                                <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

                                {/* Tags Skeleton */}
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Time and Duration Info Skeleton */}
                        <div className="grid gap-6 mb-8">
                            <div className="flex flex-col gap-4">
                                {/* DateTime Skeleton */}
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    </div>
                                </div>

                                {/* Attendance Scope Skeleton */}
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                    <div className="h-5 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>

                                {/* Contest Link Skeleton */}
                                <div className="flex items-center gap-2">
                                    <LinkIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>

                                {/* Password Skeleton */}
                                <div className="flex items-center gap-2">
                                    <Key className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Description Skeleton */}
                        <div className="space-y-4">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Contest Statistics Skeleton */}
                        <div className="mt-12">
                            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                    <tr>
                                        {['Participant', 'Solved', 'Upsolved', 'Status'].map((header) => (
                                            <th
                                                key={header}
                                                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs
                                                             font-medium text-gray-500 dark:text-gray-400 uppercase
                                                             tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200
                                                   dark:divide-gray-700">
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded
                                                                animate-pulse" />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded
                                                                animate-pulse" />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded
                                                                animate-pulse" />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded
                                                                animate-pulse" />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}