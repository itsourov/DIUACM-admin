import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { intervalToDuration } from 'date-fns';
import { EventHeader } from './components/EventHeader';
import { EventTabs } from './components/EventTabs';
import Link from 'next/link';
import { auth } from '@/lib/auth';

type PageProps = {
    params: { id: string };
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
    const event = await getEvent(params.id);
    const session = await auth();

    if (!event) {
        notFound();
    }

    const now = new Date();
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    const isUpcoming = startDate > now;
    const isRunning = startDate <= now && endDate >= now;

    const duration = intervalToDuration({ start: startDate, end: endDate });
    const formatDuration = () => {
        const hours = duration.hours || 0;
        const minutes = duration.minutes || 0;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/events"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    {/* Progress bar for running events */}
                    {isRunning && (
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700">
                            <div
                                className="h-full bg-blue-500 animate-pulse"
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
