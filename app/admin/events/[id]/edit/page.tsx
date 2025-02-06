import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { EventForm } from "@/app/admin/events/components/EventForm";
import { getEventAction, updateEventAction } from "@/app/admin/events/actions";
import { getEventRanklists } from "../actions";
import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageRanklists } from "../manage-ranklists";

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
    const [event, ranklists] = await Promise.all([
        getEventAction(params.id),
        getEventRanklists(params.id),
    ]);

    if (!event) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <Card className="mb-6">
                <CardHeader className="space-y-1">
                    <CardTitle>Event: {event.title}</CardTitle>
                </CardHeader>
            </Card>

            <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="ranklists">
                        Ranklists ({ranklists?.length || 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardContent className="pt-6">
                            <EventForm
                                initialData={event}
                                action={updateEventAction}
                                isEditing={true}
                                eventId={params.id}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ranklists">
                    <Card>
                        <CardContent className="pt-6">
                            <ManageRanklists
                                eventId={params.id}
                                initialRanklists={ranklists || []}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}