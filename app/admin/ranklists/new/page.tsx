import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RanklistForm } from "../components/RanklistForm";
import { createRanklistAction } from "../actions";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Ranklist',
    description: 'Create a new ranklist in the system',
};

export default function NewRanklistPage() {
    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Ranklist</CardTitle>
                </CardHeader>
                <CardContent>
                    <RanklistForm
                        action={createRanklistAction}
                        isEditing={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}