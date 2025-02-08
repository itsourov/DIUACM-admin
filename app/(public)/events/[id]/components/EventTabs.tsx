'use client';

import { useState } from 'react';
import { Event, EventAttendance, ContestStatOfUser, User } from '@prisma/client';
import { AttendanceForm } from './AttendanceForm';
import { AttendanceStatus } from './AttendanceStatus';
import { ContestStatsTable } from './ContestStatsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ExtendedEvent = Event & {
    attendees: (EventAttendance & { user: User })[];
    contestStats: (ContestStatOfUser & { user: User })[];
};

interface EventTabsProps {
    event: ExtendedEvent;
    currentUserId?: string;
    isCompleted: boolean;
}

export function EventTabs({ event, currentUserId, isCompleted }: EventTabsProps) {
    const [activeTab, setActiveTab] = useState('details');
    const userAttendance = event.attendees.find(a => a.userId === currentUserId);

    // Calculate available tabs based on event type and attendance settings
    const tabs = [
        { id: 'details', label: 'Details' },
        ...(event.openForAttendance ? [{
            id: 'attendance',
            label: `Attendance (${event.attendees.length})`
        }] : []),
        ...(event.type === 'CONTEST' ? [{
            id: 'standings',
            label: `Standings (${event.contestStats.length})`
        }] : [])
    ];

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full md:w-auto p-1 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm 
                               rounded-lg flex flex-wrap md:inline-flex">
                {tabs.map(tab => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex-1 md:flex-none min-w-[120px] data-[state=active]:bg-white 
                                 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="details" className="space-y-6">
                {event.openForAttendance && !isCompleted && (
                    userAttendance ? (
                        <AttendanceStatus attendedAt={userAttendance.attendedAt} />
                    ) : (
                        <AttendanceForm event={event} />
                    )
                )}
                <div className="prose dark:prose-invert max-w-none">
                    {event.description ? (
                        <div dangerouslySetInnerHTML={{ __html: event.description }} />
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                            No additional details available.
                        </p>
                    )}
                </div>
            </TabsContent>

            {event.openForAttendance && (
                <TabsContent value="attendance">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
                                  dark:border-gray-700 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {event.attendees.map((attendance) => (
                                        <tr key={attendance.id}
                                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 
                                                     dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-3">{attendance.user.name}</td>
                                            <td className="px-4 py-3">
                                                {new Date(attendance.attendedAt).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {event.attendees.length === 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No attendees yet
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            )}

            {event.type === 'CONTEST' && (
                <TabsContent value="standings">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 
                                  dark:border-gray-700 shadow-sm">
                        <ContestStatsTable stats={event.contestStats} />
                    </div>
                </TabsContent>
            )}
        </Tabs>
    );
}
