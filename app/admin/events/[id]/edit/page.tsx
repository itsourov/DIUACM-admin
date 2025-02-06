import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { EventForm } from "../../components/EventForm";
import { updateEventAction } from "../../actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageRanklists } from "../manage-ranklists";
import { Metadata } from 'next';

interface EditEventPageProps {
    params: { id: string };
}

async function getEventData(id: string) {
    try {
        const [event, ranklists] = await Promise.all([
            prisma.event.findUnique({
                where: { id },
            }),
            prisma.ranklist.findMany({
                where: {
                    events: {
                        some: {
                            eventId: id,
                        },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    keyword: true,
                    events: {
                        where: {
                            eventId: id,
                        },
                        select: {
                            weight: true,
                        },
                    },
                },
            }),
        ]);

        if (!event) {
            return null;
        }

        const transformedRanklists = ranklists.map(ranklist => ({
            ...ranklist,
            weight: ranklist.events[0]?.weight || 1.0,
        }));

        return {
            event,
            ranklists: transformedRanklists,
        };
    } catch (error) {
        console.error('Error fetching event data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: EditEventPageProps): Promise<Metadata> {
    const data = await getEventData(params.id);
    if (!data) return { title: 'Event Not Found' };

    return {
        title: `Edit Event - ${data.event.title}`,
        description: `Edit event details for ${data.event.title}`,
    };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const data = await getEventData(params.id);

    if (!data) {
        notFound();
    }

    const { event, ranklists } = data;

    return (
        <div className="container py-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Event: {event.title}</CardTitle>
                </CardHeader>
            </Card>

            <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="ranklists">
                        Ranklists ({ranklists.length})
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
                                eventId={event.id}
                                initialRanklists={ranklists}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}