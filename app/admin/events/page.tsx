// app/admin/events/page.tsx

import { Metadata } from 'next';
import { getEventsAction } from './actions';
import { EventsList } from './components/EventsList';

export const metadata: Metadata = {
    title: 'Events Management',
    description: 'Manage events in the system',
};

interface EventsPageProps {
    searchParams: {
        page?: string;
        search?: string;
    };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const search = searchParams.search || '';

    const { data: events, totalPages, currentPage } = await getEventsAction({
        page,
        search,
    });

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Events Management</h2>
                    <p className="text-muted-foreground">
                        Create and manage events in the system
                    </p>
                </div>

                <EventsList
                    events={events}
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}