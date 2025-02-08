// app/events/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section Skeleton */}
            <section className="relative py-20 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Events
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Browse and search through our events
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search Form Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Event Cards Skeleton */}
                <div className="mt-8 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-8 flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="hidden sm:flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}