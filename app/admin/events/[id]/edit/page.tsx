// app/admin/events/[id]/edit/page.tsx

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { EventForm } from "@/app/admin/events/components/EventForm";
import { getEventAction, updateEventAction } from "@/app/admin/events/actions";
import { Metadata } from 'next';

interface EditEventPageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: EditEventPageProps): Promise<Metadata> {
    const event = await getEventAction(params.id);
    if (!event) return { title: 'Event Not Found' };

    return {
        title: `Edit Event - ${event.title}`,
        description: `Edit event details for ${event.title}`,
    };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const event = await getEventAction(params.id);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle>Edit Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <EventForm
                        initialData={event}
                        action={updateEventAction}
                        isEditing={true}
                        eventId={params.id}
                    />
                </CardContent>
            </Card>
        </div>
    );
}