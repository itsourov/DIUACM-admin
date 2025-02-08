'use client';

import { useState } from 'react';
import { Event, EventAttendance, User } from '@prisma/client';
import { DateTime } from '@/lib/utils/datetime';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { markAttendance } from '../actions';

type Props = {
    event: Event & {
        attendees: (EventAttendance & {
            user: User;
        })[];
    };
    currentUserId?: string;
};

export function EventAttendanceTab({ event, currentUserId }: Props) {
    const [password, setPassword] = useState('');
    const { toast } = useToast();
    const hasAttended = event.attendees.some(a => a.userId === currentUserId);
    const now = new Date();
    const canAttend = event.openForAttendance &&
        now >= new Date(event.startDateTime) &&
        now <= new Date(event.endDateTime);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await markAttendance(event.id, password);
            toast({
                title: "Success",
                description: "Your attendance has been marked.",
            });
            setPassword('');
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to mark attendance",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            {canAttend && !hasAttended && currentUserId && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Enter attendance password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Mark Attendance</Button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Participant
                            </th>
                            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Time
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {event.attendees.map((attendance) => (
                            <tr key={attendance.id}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {attendance.user.name}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {DateTime.formatDisplay(attendance.attendedAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
