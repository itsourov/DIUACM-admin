import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { TrackerForm } from "../../components/TrackerForm";
import { getTrackerAction, updateTrackerAction } from "../../actions";
import { Metadata } from 'next';

interface EditTrackerPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditTrackerPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const tracker = await getTrackerAction(resolvedParams.id);
    if (!tracker) return { title: 'Tracker Not Found' };

    return {
        title: `Edit Tracker - ${tracker.title}`,
        description: `Edit tracker details for ${tracker.title}`,
    };
}

export default async function EditTrackerPage({ params }: EditTrackerPageProps) {
    const resolvedParams = await params;
    const tracker = await getTrackerAction(resolvedParams.id);

    if (!tracker) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle>Edit Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    <TrackerForm
                        initialData={tracker}
                        action={updateTrackerAction}
                        isEditing={true}
                        trackerId={resolvedParams.id}
                    />
                </CardContent>
            </Card>
        </div>
    );
}