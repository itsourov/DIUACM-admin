'use client'

import { EventWithRelations } from './types'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Calendar, Clock, ArrowRight, RefreshCw } from 'lucide-react'
import { DateTime } from '@/lib/utils/datetime'
import Link from 'next/link'
import EventTypeBadge from './EventTypeBadge'
import AttendanceScopeBadge from './AttendanceScopeBadge'
import EventTimeBadge from './EventTimeBadge'
import { cn } from '@/lib/utils'

interface EventListProps {
    initialEvents: EventWithRelations[]
    totalPages: number
    currentPage: number
    totalEvents: number
    initialSearch: string
}

export default function EventList({
    initialEvents,
    totalPages,
    currentPage,
    totalEvents,
    initialSearch,
}: EventListProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [search, setSearch] = useState(initialSearch)
    const [isPending, startTransition] = useTransition()

    const updateUrlAndFetch = (
        newSearch = search,
        page = 1
    ): void => {
        const params = new URLSearchParams(searchParams.toString())

        if (newSearch) params.set('q', newSearch)
        else params.delete('q')

        if (page > 1) params.set('page', page.toString())
        else params.delete('page')

        startTransition(() => {
            router.push(`/events?${params.toString()}`, { scroll: false })
        })
    }

    const resetFilters = (): void => {
        setSearch('')
        startTransition(() => {
            router.push('/events', { scroll: false })
        })
    }

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"/>
                        <Input
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && updateUrlAndFetch()}
                            className="pl-10 pr-4 h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => updateUrlAndFetch()}
                            disabled={isPending}
                            size="sm"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-10 px-4"
                        >
                            Search
                        </Button>

                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            size="sm"
                            className="w-full sm:w-auto h-10 px-4 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <RefreshCw className="w-4 h-4 mr-2"/>
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Active Filters */}
                {search && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <span className="mr-1">Search:</span>
                            <span className="font-medium">{search}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {initialEvents.length > 0 ? (
                    initialEvents.map((event) => (
                        <Link
                            href={`/events/${event.id}`}
                            key={event.id}
                            className="block"
                        >
                            <div className="group bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Event Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <EventTimeBadge
                                                    startDateTime={event.startDateTime}
                                                    endDateTime={event.endDateTime}
                                                />
                                                <EventTypeBadge type={event.type}/>
                                                <AttendanceScopeBadge scope={event.attendanceScope}/>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {event.title}
                                            </h3>
                                            {event.description && (
                                                <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Event Time */}
                                        <div className="flex flex-col md:items-end gap-2">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Calendar className="w-4 h-4 flex-shrink-0"/>
                                                <span className="text-sm whitespace-nowrap">
                                                    {DateTime.formatDisplay(event.startDateTime)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Clock className="w-4 h-4 flex-shrink-0"/>
                                                <span className="text-sm whitespace-nowrap">
                                                    {getDuration(event.startDateTime, event.endDateTime)}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className="hidden md:flex items-center text-gray-400 group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400">
                                            <ArrowRight className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-gray-600 dark:text-gray-400">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                            <h3 className="text-lg font-semibold mb-2">No events found</h3>
                            <p className="text-sm">
                                {search
                                    ? "Try adjusting your filters"
                                    : "No upcoming events are scheduled"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                        Showing {Math.min(10 * (currentPage - 1) + 1, totalEvents)} to{' '}
                        {Math.min(10 * currentPage, totalEvents)} of {totalEvents} events
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => updateUrlAndFetch(search, currentPage - 1)}
                            disabled={currentPage === 1 || isPending}
                            className="bg-white dark:bg-gray-800"
                        >
                            Previous
                        </Button>

                        <div className="hidden sm:flex gap-2">
                            {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                                const pageNum = currentPage <= 3
                                    ? i + 1
                                    : currentPage + i - 2

                                if (pageNum <= totalPages) {
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === currentPage ? "default" : "outline"}
                                            onClick={() => updateUrlAndFetch(search, pageNum)}
                                            disabled={isPending}
                                            className={cn(
                                                "min-w-[40px]",
                                                pageNum === currentPage
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                    : "bg-white dark:bg-gray-800"
                                            )}
                                        >
                                            {pageNum}
                                        </Button>
                                    )
                                }
                                return null
                            })}
                        </div>

                        <div className="sm:hidden">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => updateUrlAndFetch(search, currentPage + 1)}
                            disabled={currentPage === totalPages || isPending}
                            className="bg-white dark:bg-gray-800"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

function getDuration(start: Date, end: Date): string {
    const diff = new Date(end).getTime() - new Date(start).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours === 0) return `${minutes} minutes`
    if (minutes === 0) return `${hours} hours`
    return `${hours}h ${minutes}m`
}

