import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Hero Section with same gradient as events page */}
            <div className="flex-1 flex items-center justify-center">
                <section className="text-center px-4">
                    <div className="space-y-4">
                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
                            404
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                            Page Not Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                Return Home
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}