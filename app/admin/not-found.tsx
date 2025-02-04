import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mt-4">Admin Page Not Found</h2>
                <p className="text-gray-600 mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
                <Link
                    href="/admin"
                    className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Back to Admin Dashboard
                </Link>
            </div>
        </div>
    )
}