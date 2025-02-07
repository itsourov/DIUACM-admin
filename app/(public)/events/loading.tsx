import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingEvents() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Hero Section Skeleton */}
            <section className="relative py-16 md:py-20 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-blue-950/50 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                </div>
            </section>

            <section className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Search Bar Skeleton */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Skeleton className="h-10 flex-1" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </div>
                    </div>

                    {/* Event Cards Skeleton */}
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                                key={i}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Skeleton className="h-6 w-24" />
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                        <Skeleton className="h-7 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-full max-w-2xl" />
                                    </div>
                                    <div className="flex flex-col md:items-end gap-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <Skeleton className="h-5 w-48" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
