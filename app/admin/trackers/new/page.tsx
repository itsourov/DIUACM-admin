import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrackerForm } from "../components/TrackerForm";
import { createTrackerAction } from "../actions";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Tracker',
    description: 'Create a new tracker in the system',
};

export default function NewTrackerPage() {
    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    <TrackerForm
                        action={createTrackerAction}
                        isEditing={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}