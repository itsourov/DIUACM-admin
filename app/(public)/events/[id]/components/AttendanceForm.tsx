'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { markAttendance } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, AlertTriangle, Clock } from 'lucide-react';
import { Event } from '@prisma/client';

interface AttendanceFormProps {
    event: Event; // Now passing the full event object
}

export function AttendanceForm({ event }: AttendanceFormProps) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const now = new Date();
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    const attendanceStartTime = new Date(startDate.getTime() - 15 * 60000); // 15 minutes before
    const attendanceEndTime = new Date(endDate.getTime() + 15 * 60000); // 15 minutes after

    if (now > attendanceEndTime) {
        return (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                            Attendance Period Ended
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                            Attendance was open until {format(attendanceEndTime, 'h:mm a')}
                            (15 minutes after event end).
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (now < attendanceStartTime) {
        return (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                            Attendance Opens Soon
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            Attendance will open at {format(attendanceStartTime, 'h:mm a')}
                            (15 minutes before event start).
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await markAttendance(event.id, password);
            toast({
                title: "Success!",
                description: "Your attendance has been marked.",
                variant: "default",
            });
            // Reload the page to show updated attendance status
            window.location.reload();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to mark attendance",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                Mark Your Attendance
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Enter the event password to mark your attendance. Attendance taking closes at{' '}
                {format(endDate, 'h:mm a')}.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <Input
                        type="password"
                        placeholder="Enter event password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9"
                        required
                    />
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Marking..." : "Mark Attendance"}
                </Button>
            </form>
        </div>
    );
}
