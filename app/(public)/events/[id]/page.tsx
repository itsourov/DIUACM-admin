// app/events/[id]/page.tsx
import {notFound} from 'next/navigation';
import {format, formatDistanceToNow, intervalToDuration} from 'date-fns';
import {prisma} from '@/lib/prisma';
import {CalendarClock, Users, Link as LinkIcon, Key} from 'lucide-react';
import {AttendanceScope, EventStatus, EventType} from '@prisma/client';
import Link from 'next/link';


type PageProps = {
    params: Promise<{ id: string }>;
};

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: {id},
        include: {
            contestStats: {
                include: {
                    user: true,
                },
                orderBy: {
                    solveCount: 'desc'
                }
            },
            ranklists: {
                include: {
                    ranklist: true
                }
            }
        },
    });

    if (!event || event.status === EventStatus.DRAFT) {
        return null;
    }

    return event;
}

const getScopeConfig = (scope: AttendanceScope) => {
    switch (scope) {
        case 'PUBLIC':
            return {
                icon: '👥',
                label: 'Open for All',
                description: 'This event is open to all participants',
                class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            };
        case 'ONLY_GIRLS':
            return {
                icon: '👩',
                label: 'Girls Only',
                description: 'This event is exclusively for female participants',
                class: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
            };
        case 'JUNIOR_PROGRAMMERS':
            return {
                icon: '🌱',
                label: 'Junior Devs',
                description: 'This event is for junior developers',
                class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            };
    }
};

const getTypeConfig = (type: EventType) => {
    switch (type) {
        case 'CLASS':
            return {
                icon: '📚',
                label: 'Class',
                description: 'Educational session or workshop',
                class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            };
        case 'CONTEST':
            return {
                icon: '🏆',
                label: 'Contest',
                description: 'Competitive programming contest',
                class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            };
        case 'MEETING':
            return {
                icon: '👥',
                label: 'Meeting',
                description: 'Group discussion or meetup',
                class: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
            };
    }
};

export default async function EventDetailsPage({params}: PageProps) {
    const resolvedParams = await params;

    const event = await getEvent(resolvedParams.id);

    if (!event) {
        notFound();
    }

    const now = new Date();
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    const isUpcoming = startDate > now;
    const isRunning = startDate <= now && endDate >= now;

    const duration = intervalToDuration({start: startDate, end: endDate});
    const formatDuration = () => {
        const hours = duration.hours || 0;
        const minutes = duration.minutes || 0;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    };

    const scopeConfig = getScopeConfig(event.attendanceScope);
    const typeConfig = getTypeConfig(event.type);

    const getStatusConfig = () => {
        if (isRunning) return {
            label: 'Happening Now',
            class: 'bg-orange-500 text-white',
            animation: 'animate-pulse'
        };
        if (isUpcoming) return {
            label: formatDistanceToNow(startDate, {addSuffix: true}),
            class: 'bg-emerald-500 text-white',
            animation: ''
        };
        return {
            label: 'Ended',
            class: 'bg-gray-500 text-white',
            animation: ''
        };
    };

    const statusConfig = getStatusConfig();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Back Button */}
            <div className="max-w-7xl flex justify-between mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/events"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400
                             dark:hover:text-gray-300 transition-colors"
                >
                    <svg
                        className="mr-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Events
                </Link>



            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                              shadow-sm overflow-hidden">
                    {/* Event Status Bar */}
                    {isRunning && (
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700">
                            <div
                                className={`h-full bg-blue-500 ${statusConfig.animation}`}
                                style={{
                                    width: `${Math.min(
                                        100,
                                        ((now.getTime() - startDate.getTime()) /
                                            (endDate.getTime() - startDate.getTime())) *
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                    )}

                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {event.title}
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.class} 
                                                 ${statusConfig.animation}`}
                                    >
                                        {statusConfig.label}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${typeConfig.class}`}
                                    >
                                        {typeConfig.icon} {typeConfig.label}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${scopeConfig.class}`}
                                    >
                                        {scopeConfig.icon} {scopeConfig.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Time and Duration Info */}
                        <div className="grid gap-6 mb-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <CalendarClock className="w-5 h-5"/>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
                                        <span className="text-gray-400 dark:text-gray-500">•</span>
                                        <code className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-900 rounded">
                                            {format(startDate, 'HH:mm')} → {format(endDate, 'HH:mm')}
                                        </code>
                                        <span className="text-gray-400 dark:text-gray-500">•</span>
                                        <code className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-900 rounded">
                                            ⏱️ {formatDuration()}
                                        </code>
                                    </div>
                                </div>

                                {/* Attendance Scope */}
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Users className="w-5 h-5"/>
                                    <span>{scopeConfig.description}</span>
                                </div>

                                {/* Contest Links (if available) */}
                                {event.contestLink && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <LinkIcon className="w-5 h-5"/>
                                        <a
                                            href={event.contestLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400
                                                     dark:hover:text-blue-300"
                                        >
                                            Contest Link
                                        </a>
                                    </div>
                                )}

                                {/* Contest Password (if available) */}
                                {event.contestPassword && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                        <Key className="w-5 h-5"/>
                                        <code className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-900 rounded">
                                            {event.contestPassword}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ranklists */}
                        {event.ranklists.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Ranklists</h2>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                                    {event.ranklists.map(({ranklist, weight}) => (
                                        <li key={ranklist.id} className="flex justify-between items-center">
                                            <Link href={`/ranklist/${ranklist.id}`}
                                                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                                                {ranklist.title}
                                            </Link>
                                            <span className="text-gray-500 dark:text-gray-400">Weight: {weight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        {event.description && (
                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <h2 className="text-xl font-semibold mb-4">About this Event</h2>
                                <div className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                    {event.description}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contest Statistics */}
                {event.type === 'CONTEST' && event.contestStats.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                                  shadow-sm overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-semibold mb-6">Contest Statistics</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                    <tr>
                                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs
                                                       font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Participant
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs
                                                       font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Solved
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs
                                                       font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Upsolved
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs
                                                       font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs
                                                       font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody
                                        className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {event.contestStats.map((stat) => (
                                        <tr key={stat.id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium
                                                           text-gray-900 dark:text-white">
                                                {stat.user.name}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500
                                                           dark:text-gray-400">
                                                {stat.solveCount}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500
                                                           dark:text-gray-400">
                                                {stat.upsolveCount}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                {stat.isAbsent ? (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full
                                                                     bg-red-100 text-red-800 dark:bg-red-900/30
                                                                     dark:text-red-300">
                                                            Absent
                                                        </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full
                                                                     bg-green-100 text-green-800 dark:bg-green-900/30
                                                                     dark:text-green-300">
                                                            Present
                                                        </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500
                                                           dark:text-gray-400">
                                                {formatDistanceToNow(new Date(stat.lastUpdated), {addSuffix: true})}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
