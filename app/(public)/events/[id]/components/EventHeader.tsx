import { format } from 'date-fns';
import { Calendar, Users, Link as LinkIcon, Lock, Clock, AlertCircle } from 'lucide-react';
import { Event } from '@prisma/client';

interface EventHeaderProps {
    event: Event;
    isUpcoming: boolean;
    isRunning: boolean;
    formatDuration: () => string;
}

export function EventHeader({ event, isUpcoming, isRunning, formatDuration }: EventHeaderProps) {
    const now = new Date();
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    const attendanceStartTime = new Date(startDate.getTime() - 15 * 60000); // 15 minutes before
    const attendanceEndTime = new Date(endDate.getTime() + 15 * 60000); // 15 minutes after

    const getAttendanceStatus = () => {
        if (!event.openForAttendance) {
            return {
                icon: <Lock className="w-5 h-5 text-gray-400" />,
                text: "Attendance is closed",
                color: "text-gray-600 dark:text-gray-300"
            };
        }

        if (now > attendanceEndTime) {
            return {
                icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
                text: "Attendance period has ended",
                color: "text-yellow-600 dark:text-yellow-300"
            };
        }

        if (now < attendanceStartTime) {
            return {
                icon: <Clock className="w-5 h-5 text-blue-500" />,
                text: `Attendance opens at ${format(attendanceStartTime, 'h:mm a')} (15 min before event)`,
                color: "text-blue-600 dark:text-blue-300"
            };
        }

        return {
            icon: <Users className="w-5 h-5 text-green-500" />,
            text: "Attendance taking is active",
            color: "text-green-600 dark:text-green-300"
        };
    };

    const attendanceStatus = getAttendanceStatus();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white 
                             tracking-tight">{event.title}</h1>
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${event.type === 'CONTEST'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 ring-purple-400/30'
                            : event.type === 'CLASS'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 ring-blue-400/30'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 ring-green-400/30'
                        } ring-1 ring-inset`}>
                        {event.type}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-gray-600 dark:text-gray-300">
                                {format(new Date(event.startDateTime), 'MMMM d, yyyy')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(event.startDateTime), 'h:mm a')} -
                                {format(new Date(event.endDateTime), 'h:mm a')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                            Duration: {formatDuration()}
                        </span>
                    </div>

                    {event.contestLink && (
                        <div className="flex items-center space-x-3">
                            <LinkIcon className="w-5 h-5 text-gray-400" />
                            <a
                                href={event.contestLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 
                                         dark:hover:text-blue-300 transition-colors"
                            >
                                Contest Platform Link
                            </a>
                        </div>
                    )}
                </div>

                {event.openForAttendance && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 
                                      dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                            {attendanceStatus.icon}
                            <div className="flex flex-col">
                                <span className={`${attendanceStatus.color} font-medium`}>
                                    {attendanceStatus.text}
                                </span>
                                {isRunning && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Closes at {format(endDate, 'h:mm a')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {event.contestPassword && (isRunning || isUpcoming) && (
                            <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 
                                          dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                <Lock className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-300">
                                    Password required for attendance
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {event.description && (
                <div className="prose dark:prose-invert max-w-none 
                              prose-headings:text-gray-900 dark:prose-headings:text-white
                              prose-p:text-gray-600 dark:prose-p:text-gray-300">
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                </div>
            )}
        </div>
    );
}
