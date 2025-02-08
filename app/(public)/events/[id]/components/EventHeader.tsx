import { Event } from '@prisma/client';
import { DateTime } from '@/lib/utils/datetime';
import { CalendarClock, Users, Link as LinkIcon } from 'lucide-react';
import { getScopeConfig, getTypeConfig } from '../utils/event-configs';

type Props = {
    event: Event;
    isUpcoming: boolean;
    isRunning: boolean;
    formatDuration: () => string;
};

export function EventHeader({ event, isUpcoming, isRunning, formatDuration }: Props) {
    const scopeConfig = getScopeConfig(event.attendanceScope);
    const typeConfig = getTypeConfig(event.type);

    const getStatusConfig = () => {
        if (isRunning) return {
            label: 'Happening Now',
            class: 'bg-orange-500 text-white',
            animation: 'animate-pulse'
        };
        if (isUpcoming) return {
            label: 'Upcoming',
            class: 'bg-emerald-500 text-white',
            animation: ''
        };
        return {
            label: 'Ended',
            class: 'bg-gray-500 text-white',
            animation: ''
        };
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {event.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                    {/* Status badges */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig().class}`}>
                        {getStatusConfig().label}
                    </span>
                    {/* Type badge */}
                    {/* Scope badge */}
                    {/* ...other badges... */}
                </div>
            </div>

            {/* Event details grid */}
            <div className="grid gap-4">
                {/* DateTime */}
                <div className="flex items-center gap-2">
                    <CalendarClock className="w-5 h-5" />
                    <span>{DateTime.formatDisplay(event.startDateTime)}</span>
                    <span>({formatDuration()})</span>
                </div>

                {/* Other details */}
                {event.contestLink && (
                    <div className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        <a href={event.contestLink} target="_blank" rel="noopener noreferrer"
                            className="text-blue-500 hover:underline">
                            Contest Link
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
