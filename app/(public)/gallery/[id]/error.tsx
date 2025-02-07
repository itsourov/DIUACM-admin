// app/gallery/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-xl mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    We couldn&apos;t load the gallery. Please try again later.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/gallery"
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Back to galleries
                    </Link>
                </div>
            </div>
        </div>
    );
}