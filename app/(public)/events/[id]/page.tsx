import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { intervalToDuration } from 'date-fns';
import { EventHeader } from './components/EventHeader';
import { EventTabs } from './components/EventTabs';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { ChevronLeft, Timer } from 'lucide-react';

type PageProps = {
    params: Promise<{ id: string }>;
};

async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            contestStats: {
                include: {
                    user: true,
                },
                orderBy: {
                    solveCount: 'desc',
                }
            },
            attendees: {
                include: {
                    user: true,
                },
                orderBy: {
                    attendedAt: 'desc',
                }
            },
            ranklists: {
                include: {
                    ranklist: true,
                }
            }
        },
    });

    if (!event) {
        return null;
    }

    return event;
}

export default async function EventDetailsPage({ params }: PageProps) {
    // Await the params before using them
    const resolvedParams = await params;
    const event = await getEvent(resolvedParams.id);
    const session = await auth();

    if (!event) {
        notFound();
    }

    const now = new Date();
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    const isUpcoming = startDate > now;
    const isRunning = startDate <= now && endDate >= now;
    const isCompleted = endDate < now;

    const duration = intervalToDuration({ start: startDate, end: endDate });
    const formatDuration = () => {
        const hours = duration.hours || 0;
        const minutes = duration.minutes || 0;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    };

    const getStatusClass = () => {
        if (isUpcoming) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        if (isRunning) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    };

    const getStatusText = () => {
        if (isUpcoming) return 'Upcoming';
        if (isRunning) return 'In Progress';
        return 'Completed';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Floating Back Button */}
            <div className="fixed top-4 left-4 z-10">
                <Link
                    href="/events"
                    className="group flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
                             rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 
                                         group-hover:-translate-x-1 transition-transform" />
                    <span className="text-gray-600 dark:text-gray-300">Back</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl 
                              border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                    {isRunning && (
                        <div className="relative h-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                                          opacity-20 blur-sm" />
                            <div
                                className="relative h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
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

                    <div className="p-8">
                        {/* Status Badge */}
                        <div className="flex justify-between items-center mb-6">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                          ${getStatusClass()}`}>
                                <Timer className="w-4 h-4 mr-1.5" />
                                {getStatusText()}
                            </div>
                            {isRunning && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDuration()} remaining
                                </div>
                            )}
                        </div>

                        <EventHeader
                            event={event}
                            isUpcoming={isUpcoming}
                            isRunning={isRunning}
                            formatDuration={formatDuration}
                        />

                        <div className="mt-8">
                            <EventTabs
                                event={event}
                                currentUserId={session?.user?.id}
                                isCompleted={isCompleted}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}