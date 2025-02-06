'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function attachRanklist(eventId: string, ranklistId: string, weight: number) {
    try {
        await prisma.eventsOnRanklists.create({
            data: {
                eventId,
                ranklistId,
                weight: parseFloat(weight.toFixed(1)), // Ensure 1 decimal place
            },
        })
        revalidatePath(`/admin/events/${eventId}/edit`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: 'Failed to attach ranklist' }
    }
}

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
        console.error(error)
        return { success: false, error: 'Failed to detach ranklist' }
    }
}

export async function updateRanklistWeight(eventId: string, ranklistId: string, weight: number) {
    try {
        // Validate weight is between 0 and 1
        const validWeight = Math.max(0, Math.min(1, parseFloat(weight.toFixed(2))))

        await prisma.eventsOnRanklists.update({
            where: {
                eventId_ranklistId: {
                    eventId,
                    ranklistId,
                },
            },
            data: { weight: validWeight },
        })
        revalidatePath(`/admin/events/${eventId}/edit`)
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: 'Failed to update ranklist weight' }
    }
}

export async function getAvailableRanklists(eventId: string, search: string, page: number = 1) {
    try {
        const take = 10
        const validPage = Math.max(1, page)
        const skip = (validPage - 1) * take

        const where = {
            NOT: {
                events: {
                    some: {
                        eventId,
                    },
                },
            },
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
                {
                    keyword: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
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
                    createdAt: 'desc',
                },
            }),
            prisma.ranklist.count({ where }),
        ])

        return {
            success: true,
            ranklists,
            total,
            pages: Math.ceil(total / take),
            currentPage: validPage
        }
    } catch (error) {
        console.error(error)
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