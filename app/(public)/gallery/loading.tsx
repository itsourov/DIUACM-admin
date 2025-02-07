// app/gallery/loading.tsx
import { ImageIcon } from 'lucide-react';

export default function LoadingPage() {
    // Create an array of 6 items to show skeleton cards
    const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section Skeleton */}
            <section className="relative py-20 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Photo Gallery
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Explore our collection of memorable moments and events
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Grid Skeleton */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {skeletonCards.map((index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Title skeleton */}
                                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse" />

                                    {/* Description skeleton */}
                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-full" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4" />
                                    </div>

                                    {/* Footer skeleton */}
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}