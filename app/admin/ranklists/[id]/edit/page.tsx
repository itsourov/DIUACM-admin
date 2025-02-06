import {notFound} from "next/navigation"
import {prisma} from "@/lib/prisma"
import {ManageEvents} from "../manage-events"
import {ManageUsers} from "../manage-users"
import {ManageTrackers} from "../manage-trackers"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {RanklistForm} from "@/app/admin/ranklists/components/RanklistForm";
import {updateRanklistAction} from "@/app/admin/ranklists/actions";

interface EditRanklistPageProps {
    params: Promise<{ id: string }>;
}

async function getRanklistData(id: string) {
    try {
        const [ranklist, users, events, trackers] = await Promise.all([
            prisma.ranklist.findUnique({
                where: {id},
            }),
            prisma.user.findMany({
                where: {
                    ranklists: {
                        some: {
                            ranklistId: id,
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    image: true,
                    ranklists: {
                        where: {
                            ranklistId: id,
                        },
                        select: {
                            score: true,
                        },
                    },
                },
            }),
            prisma.event.findMany({
                where: {
                    ranklists: {
                        some: {
                            ranklistId: id,
                        },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    startDateTime: true,
                    ranklists: {
                        where: {
                            ranklistId: id,
                        },
                        select: {
                            weight: true,
                        },
                    },
                },
            }),
            prisma.tracker.findMany({
                where: {
                    ranklists: {
                        some: {
                            ranklistId: id,
                        },
                    },
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                },
            }),
        ])

        if (!ranklist) {
            return null
        }

        const transformedUsers = users.map(user => ({
            ...user,
            score: user.ranklists[0]?.score || 0,
        }))

        const transformedEvents = events.map(event => ({
            ...event,
            weight: event.ranklists[0]?.weight || 1.0,
        }))

        return {
            ranklist,
            users: transformedUsers,
            events: transformedEvents,
            trackers,
        }
    } catch (error) {
        console.error('Error fetching ranklist data:', error)
        return null
    }
}

export default async function EditRanklistPage({ params }: EditRanklistPageProps) {
    const resolvedParams = await params;
    const data = await getRanklistData(resolvedParams.id);

    if (!data) {
        notFound()
    }

    const {ranklist, users, events, trackers} = data

    return (
        <div className="container py-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Ranklist: {ranklist.title}</CardTitle>
                </CardHeader>
            </Card>

            <Tabs defaultValue="details" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="events">
                        Events ({events.length})
                    </TabsTrigger>
                    <TabsTrigger value="users">
                        Users ({users.length})
                    </TabsTrigger>
                    <TabsTrigger value="trackers">
                        Trackers ({trackers.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardContent className="pt-6">
                            <RanklistForm
                                initialData={ranklist}
                                action={updateRanklistAction}
                                isEditing={true}
                                ranklistId={resolvedParams.id}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="events">
                    <Card>
                        <CardContent className="pt-6">
                            <ManageEvents
                                ranklistId={ranklist.id}
                                initialEvents={events}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardContent className="pt-6">
                            <ManageUsers
                                ranklistId={ranklist.id}
                                initialUsers={users}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trackers">
                    <Card>
                        <CardContent className="pt-6">
                            <ManageTrackers
                                ranklistId={ranklist.id}
                                initialTrackers={trackers}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}