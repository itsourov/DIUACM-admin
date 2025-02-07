import { Skeleton } from "@/components/ui/skeleton"

export default function ManageAccountLoading() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tabs Skeleton */}
                    <div className="space-y-6">
                        <div className="flex overflow-x-auto gap-2 p-1 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-10 w-28"
                                />
                            ))}
                        </div>

                        {/* Content Skeleton */}
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Profile Header Skeleton */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <Skeleton className="h-20 w-20 rounded-full" />
                                    <div className="space-y-3">
                                        <Skeleton className="h-7 w-48" />
                                        <div className="flex flex-wrap gap-4">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-5 w-40" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields Skeleton */}
                            <div className="p-6 space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ))}
                                </div>

                                {/* Form Actions Skeleton */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-10 w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}