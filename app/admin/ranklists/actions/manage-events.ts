// app/admin/ranklists/actions/manage-events.ts
'use server'

import {revalidatePath} from "next/cache"
import {prisma} from "@/lib/prisma"

export async function attachEvent(ranklistId: string, eventId: string, weight: number) {
    try {
        await prisma.eventsOnRanklists.create({
            data: {
                eventId,
                ranklistId,
                weight: parseFloat(weight.toFixed(1)), // Ensure 1 decimal place
            },
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to attach event'}
    }
}

export async function detachEvent(ranklistId: string, eventId: string) {
    try {
        await prisma.eventsOnRanklists.delete({
            where: {
                eventId_ranklistId: {
                    eventId,
                    ranklistId,
                },
            },
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to detach event'}
    }
}

export async function updateEventWeight(ranklistId: string, eventId: string, weight: number) {
    try {
        // Validate weight is between 0 and 1
        const validWeight = Math.max(0, Math.min(1, parseFloat(weight.toFixed(1))))

        await prisma.eventsOnRanklists.update({
            where: {
                eventId_ranklistId: {
                    eventId,
                    ranklistId,
                },
            },
            data: {weight: validWeight},
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to update event weight'}
    }
}


export async function getAvailableEvents(ranklistId: string, search: string, page: number = 1) {
    try {
        const take = 10
        // Ensure page is at least 1 to prevent negative skip values
        const validPage = Math.max(1, page)
        const skip = (validPage - 1) * take

        const where = {
            NOT: {
                ranklists: {
                    some: {
                        ranklistId,
                    },
                },
            },
            title: {
                contains: search,
                mode: 'insensitive' as const,
            },
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    startDateTime: true,
                },
                skip,
                take,
                orderBy: {
                    startDateTime: 'desc',
                },
            }),
            prisma.event.count({where}),
        ])

        return {
            success: true,
            events,
            total,
            pages: Math.ceil(total / take),
            currentPage: validPage
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            events: [],
            total: 0,
            pages: 1,
            currentPage: 1,
            error: 'Failed to fetch available events'
        }
    }
}
