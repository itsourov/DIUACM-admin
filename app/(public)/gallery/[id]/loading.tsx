// app/gallery/[id]/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="space-y-4">
                        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-12 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}