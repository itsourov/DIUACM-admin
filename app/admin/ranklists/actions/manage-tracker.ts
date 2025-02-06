"use server"
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function attachTracker(ranklistId: string, trackerId: string) {
    try {
        await prisma.trackersOnRanklists.create({
            data: {
                trackerId,
                ranklistId,
            },
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to attach tracker'}
    }
}

export async function detachTracker(ranklistId: string, trackerId: string) {
    try {
        await prisma.trackersOnRanklists.delete({
            where: {
                trackerId_ranklistId: {
                    trackerId,
                    ranklistId,
                },
            },
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to detach tracker'}
    }
}

export async function getAvailableTrackers(ranklistId: string, search: string, page: number = 1) {
    try {
        const take = 10
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

        const [trackers, total] = await Promise.all([
            prisma.tracker.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                },
                skip,
                take,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.tracker.count({where}),
        ])

        return {
            success: true,
            trackers,
            total,
            pages: Math.ceil(total / take),
            currentPage: validPage
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            trackers: [],
            total: 0,
            pages: 1,
            currentPage: 1,
            error: 'Failed to fetch available trackers'
        }
    }
}