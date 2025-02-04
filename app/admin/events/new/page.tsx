// app/admin/events/new/page.tsx

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EventForm } from "@/app/admin/events/components/EventForm";
import { createEventAction } from "@/app/admin/events/actions";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Event',
    description: 'Create a new event in the system',
};

export default function NewEventPage() {
    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <EventForm
                        action={createEventAction}
                        isEditing={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}