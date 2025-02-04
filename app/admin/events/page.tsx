// app/admin/events/page.tsx
"use server"
import {Suspense} from 'react';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {EventsList} from "@/app/admin/events/components/EventsList";
import {getEventsAction} from "@/app/admin/events/actions";

interface EventsPageProps {
    searchParams: {
        page?: string;
        search?: string;
        status?: string;
        type?: string;
    };
}

export default async function EventsPage({searchParams}: EventsPageProps) {
    const awaitedSearchParams = await searchParams;
    const {data, currentPage, totalPages} = await getEventsAction({
        page: awaitedSearchParams?.page ? parseInt(awaitedSearchParams.page, 10) : 1,
        search: awaitedSearchParams?.search,
    });

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <EventsList
                            events={data}
                            totalPages={totalPages}
                            currentPage={currentPage}
                        />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}