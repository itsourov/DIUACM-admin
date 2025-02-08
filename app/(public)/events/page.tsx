import {Suspense} from 'react';
import {getEvents} from './actions';
import EventSearchForm from './components/EventSearchForm';
import EventCard from './components/EventCard';
import Pagination from './components/Pagination';
import {EventsSearchParams} from "@/app/(public)/events/types";
import EmptyState from "@/app/(public)/events/components/EmptyState";

type PageProps = {
    searchParams: Promise<{
        page?: string;
        query?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
    }>
}

export default async function EventsPage({searchParams}: PageProps) {
    // Await the searchParams before using them
    const resolvedParams = await searchParams;

    const {events, totalPages, currentPage} = await getEvents({
        page: resolvedParams.page ? parseInt(resolvedParams.page) : 1,
        query: resolvedParams.query,
        type: resolvedParams.type as EventsSearchParams['type'],
        startDate: resolvedParams.startDate,
        endDate: resolvedParams.endDate
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
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
                <Suspense fallback={<div>Loading search...</div>}>
                    <EventSearchForm/>
                </Suspense>

                <div className="mt-8 space-y-4">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event}/>
                    ))}

                    {events.length === 0 && (
                        <EmptyState
                            title="No Events Found"
                            message={
                                resolvedParams.query || resolvedParams.type || resolvedParams.startDate
                                    ? "We couldn't find any events matching your filters. Try adjusting your search criteria or removing some filters."
                                    : "There are no events scheduled at the moment. Check back later for updates."
                            }
                        />
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                    />
                )}
            </div>
        </div>
    );
}