'use client';

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ContestStats} from "./ContestStats";
import {EventAttendanceTab} from "./EventAttendanceTab";
import {Event, ContestStatOfUser, EventAttendance, User} from "@prisma/client";

type Props = {
    event: Event & {
        contestStats: (ContestStatOfUser & { user: User })[];
        attendees: (EventAttendance & { user: User })[];
    };
    currentUserId?: string;
};

export function EventTabs({event, currentUserId}: Props) {
    return (
        <Tabs defaultValue="details" className="w-full">
            <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="stats">Contest Stats</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                {event.description && (
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{event.description}</p>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="stats">
                <ContestStats stats={event.contestStats}/>
            </TabsContent>

            <TabsContent value="attendance">
                <EventAttendanceTab 
                    event={event}
                    currentUserId={currentUserId}
                />
            </TabsContent>
        </Tabs>
    );
}
