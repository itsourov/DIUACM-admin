'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { EventStatus, EventType, AttendanceScope } from "@prisma/client"

// Types for event actions
export type EventFormData = {
    title: string
    description?: string
    status: EventStatus
    startDateTime: Date
    endDateTime: Date
    contestLink?: string
    contestPassword?: string
    openForAttendance: boolean
    type: EventType
    weight: number
    attendanceScope: AttendanceScope
}

// Get single event with all relations
export async function getEventAction(id: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                ranklists: {
                    include: {
                        ranklist: {
                            select: {
                                id: true,
                                title: true,
                                keyword: true,
                            }
                        }
                    }
                },
                contestStats: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                username: true,
                                image: true,
                            }
                        }
                    }
                }
            }
        })

        if (!event) {
            return null
        }

        return event
    } catch (error) {
        console.error('Error fetching event:', error)
        return null
    }
}

// Update event details
export async function updateEventAction(eventId: string, data: EventFormData) {
    try {
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                startDateTime: new Date(data.startDateTime),
                endDateTime: new Date(data.endDateTime),
                contestLink: data.contestLink,
                contestPassword: data.contestPassword,
                openForAttendance: data.openForAttendance,
                type: data.type,
                weight: data.weight,
                attendanceScope: data.attendanceScope,
            }
        })

        revalidatePath(`/admin/events/${eventId}/edit`)
        return { success: true, data: updatedEvent }
    } catch (error) {
        console.error('Error updating event:', error)
        return { success: false, error: 'Failed to update event' }
    }
}

// Get event's ranklists
export async function getEventRanklists(eventId: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                ranklists: {
                    include: {
                        ranklist: {
                            select: {
                                id: true,
                                title: true,
                                keyword: true,
                            }
                        }
                    }
                }
            }
        })

        if (!event) return null

        return event.ranklists.map(r => ({
            ...r.ranklist,
            weight: r.weight
        }))
    } catch (error) {
        console.error('Error fetching event ranklists:', error)
        return null
    }
}

// Get available ranklists for the event
export async function getAvailableRanklists(eventId: string, search: string, page: number = 1) {
    try {
        const take = 10
        const skip = (page - 1) * take

        const where = {
            NOT: {
                events: {
                    some: {
                        eventId,
                    },
                },
            },
            OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { keyword: { contains: search, mode: 'insensitive' as const } },
            ],
        }

        const [ranklists, total] = await Promise.all([
            prisma.ranklist.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    keyword: true,
                },
                skip,
                take,
                orderBy: {
                    title: 'asc',
                },
            }),
            prisma.ranklist.count({ where }),
        ])

        return {
            success: true,
            ranklists,
            total,
            pages: Math.ceil(total / take),
            currentPage: page
        }
    } catch (error) {
        console.error('Error fetching available ranklists:', error)
        return {
            success: false,
            ranklists: [],
            total: 0,
            pages: 1,
            currentPage: 1,
            error: 'Failed to fetch available ranklists'
        }
    }
}

// Attach a ranklist to the event
export async function attachRanklist(eventId: string, ranklistId: string, weight: number) {
    try {
        await prisma.eventsOnRanklists.create({
            data: {
                eventId,
                ranklistId,
                weight: parseFloat(weight.toFixed(1)),
                updatedBy: 'itsourov', // Using the current user's login
            },
        })
        revalidatePath(`/admin/events/${eventId}/edit`)
        return { success: true }
    } catch (error) {
        console.error('Error attaching ranklist:', error)
        return { success: false, error: 'Failed to attach ranklist' }
    }
}

// Detach a ranklist from the event
export async function detachRanklist(eventId: string, ranklistId: string) {
    try {
        await prisma.eventsOnRanklists.delete({
            where: {
                eventId_ranklistId: {
                    eventId,
                    ranklistId,
                },
            },
        })
        revalidatePath(`/admin/events/${eventId}/edit`)
        return { success: true }
    } catch (error) {
        console.error('Error detaching ranklist:', error)
        return { success: false, error: 'Failed to detach ranklist' }
    }
}

// Update ranklist weight for the event
export async function updateRanklistWeight(eventId: string, ranklistId: string, weight: number) {
    try {
        const validWeight = Math.max(0, Math.min(1, parseFloat(weight.toFixed(1))))

        await prisma.eventsOnRanklists.update({
            where: {
                eventId_ranklistId: {
                    eventId,
                    ranklistId,
                },
            },
            data: {
                weight: validWeight,
                updatedBy: 'itsourov', // Using the current user's login
                updatedAt: new Date('2025-02-06T08:06:56Z') // Using the current UTC time
            },
        })
        revalidatePath(`/admin/events/${eventId}/edit`)
        return { success: true }
    } catch (error) {
        console.error('Error updating ranklist weight:', error)
        return { success: false, error: 'Failed to update ranklist weight' }
    }
}

// Get contest stats for the event
export async function getEventContestStats(eventId: string) {
    try {
        const stats = await prisma.contestStatOfUser.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        image: true,
                    }
                }
            },
            orderBy: {
                solveCount: 'desc'
            }
        })

        return { success: true, stats }
    } catch (error) {
        console.error('Error fetching contest stats:', error)
        return { success: false, error: 'Failed to fetch contest stats', stats: [] }
    }
}

// Update contest stats for a user
export async function updateContestStats(
    eventId: string,
    userId: string,
    data: {
        solveCount: number,
        upsolveCount: number,
        isAbsent: boolean,
        note?: string
    }
) {
    try {
        const stats = await prisma.contestStatOfUser.upsert({
            where: {
                userId_eventId: {
                    userId,
                    eventId
                }
            },
            update: {
                solveCount: data.solveCount,
                upsolveCount: data.upsolveCount,
                isAbsent: data.isAbsent,
                note: data.note,
                lastUpdated: new Date('2025-02-06T08:06:56Z') // Using the current UTC time
            },
            create: {
                userId,
                eventId,
                solveCount: data.solveCount,
                upsolveCount: data.upsolveCount,
                isAbsent: data.isAbsent,
                note: data.note,
                lastUpdated: new Date('2025-02-06T08:06:56Z') // Using the current UTC time
            }
        })

        revalidatePath(`/admin/events/${eventId}/edit`)
        return { success: true, data: stats }
    } catch (error) {
        console.error('Error updating contest stats:', error)
        return { success: false, error: 'Failed to update contest stats' }
    }
}

// Delete event
export async function deleteEventAction(eventId: string) {
    try {
        await prisma.event.delete({
            where: { id: eventId }
        })

        revalidatePath('/admin/events')
        return { success: true }
    } catch (error) {
        console.error('Error deleting event:', error)
        return { success: false, error: 'Failed to delete event' }
    }
}