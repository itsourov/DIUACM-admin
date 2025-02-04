import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { RanklistForm } from "../../components/RanklistForm";
import { getRanklistAction, updateRanklistAction } from "../../actions";
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

    return (
        <div className="container mx-auto py-6">
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
        </div>
    );
}