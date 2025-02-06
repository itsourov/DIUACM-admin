import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from 'next/navigation';
import { RanklistForm } from "../../components/RanklistForm";
import { getRanklistAction, updateRanklistAction } from "../../actions";
import { prisma } from "@/lib/prisma"
import { ManageEvents } from "../manage-events"
import { ManageUsers } from "../manage-users"
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
    // Fetch ranklist data with both basic info and related data
    const ranklist = await prisma.ranklist.findUnique({
        where: { id: params.id },
        include: {
            events: {
                include: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            startDateTime: true,
                        },
                    },
                },
            },
            users: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            username: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });

    if (!ranklist) {
        notFound();
    }

    // Transform events and users data
    const events = ranklist.events.map((e) => ({
        ...e.event,
        weight: e.weight,
    }));

    const users = ranklist.users.map((u) => ({
        ...u.user,
        score: u.score,
    }));

    return (
        <div className="container mx-auto py-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Edit Ranklist: {ranklist.title}</h1>

            <Tabs defaultValue="details" className="space-y-6">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="details">Ranklist Details</TabsTrigger>
                    <TabsTrigger value="events">Manage Events</TabsTrigger>
                    <TabsTrigger value="users">Manage Users</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle>Edit Ranklist Details</CardTitle>
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
                </TabsContent>

                <TabsContent value="events">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle>Manage Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ManageEvents
                                ranklistId={params.id}
                                initialEvents={events}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle>Manage Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ManageUsers
                                ranklistId={params.id}
                                initialUsers={users}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}