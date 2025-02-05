// app/admin/ranklists/[id]/edit/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { RanklistForm } from "../../components/RanklistForm";
import { getRanklistAction, updateRanklistAction } from "../../actions";
import { getRanklistWithEvents, getEvents } from '../actions';
import { EventManager } from '../components/event-manager';
import { Metadata } from 'next';

interface EditRanklistPageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: EditRanklistPageProps): Promise<Metadata> {
    const ranklist = await getRanklistAction(params.id);
    if (!ranklist) return { title: 'Ranklist Not Found' };

    return {
        title: `Edit Ranklist - ${ranklist.title}`,
        description: `Edit ranklist details for ${ranklist.title}`,
    };
}

export default async function EditRanklistPage({ params }: EditRanklistPageProps) {
    const ranklist = await getRanklistAction(params.id);

    if (!ranklist) {
        notFound();
    }

    const [{ selectedEvents }, availableEvents] = await Promise.all([
        getRanklistWithEvents(params.id),
        getEvents({ page: 1, limit: 10 })
    ]);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle>Edit Ranklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <RanklistForm
                        initialData={ranklist}
                        action={updateRanklistAction}
                        isEditing={true}
                        ranklistId={params.id}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <EventManager
                        ranklistId={params.id}
                        initialEvents={selectedEvents}
                        initialAvailableEvents={availableEvents}
                    />
                </CardContent>
            </Card>
        </div>
    );
}