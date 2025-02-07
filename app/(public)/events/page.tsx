import { Metadata } from 'next'
import EventList from './components/EventList'
import { getEvents } from './actions'
import { SearchParams } from './types'

export const metadata: Metadata = {
    title: 'Events - Programming Contests & Classes',
    description: 'Discover upcoming programming contests, coding classes, and tech events. Join our community and enhance your programming skills.',
}

interface PageProps {
    searchParams: Promise<SearchParams>
}

export default async function EventsPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams
    const page = Number(resolvedParams.page) || 1
    const search = resolvedParams.q || ''

    const data = await getEvents(page, search)

    if (!data) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Unable to load events
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please refresh the page or try again later.
                    </p>
                </div>
            </div>
        )
    }

    const { events, total, totalPages } = data

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <section className="relative py-16 md:py-20 bg-gradient-to-b from-blue-50 to-gray-100 dark:from-blue-950/50 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Programming Events
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Join contests, attend workshops, and connect with fellow programmers
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <EventList
                        initialEvents={events}
                        totalPages={totalPages}
                        currentPage={page}
                        totalEvents={total}
                        initialSearch={search}
                    />
                </div>
            </section>
        </div>
    )
}