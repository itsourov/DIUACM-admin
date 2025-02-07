// app/gallery/[id]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-xl mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Gallery Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    The gallery you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link
                    href="/gallery"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to galleries
                </Link>
            </div>
        </div>
    );
}