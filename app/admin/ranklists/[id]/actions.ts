//app/admin/ranklists/[id]/actions.ts
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

export async function attachUser(ranklistId: string, userId: string, score: number) {
    try {
        await prisma.usersOnRanklists.create({
            data: {
                userId,
                ranklistId,
                score: parseFloat(score.toFixed(2)), // Ensure 2 decimal places
            },
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to attach user'}
    }
}

export async function detachUser(ranklistId: string, userId: string) {
    try {
        await prisma.usersOnRanklists.delete({
            where: {
                userId_ranklistId: {
                    userId,
                    ranklistId,
                },
            },
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to detach user'}
    }
}

export async function updateUserScore(ranklistId: string, userId: string, score: number) {
    try {
        // Ensure score is non-negative and has 2 decimal places
        const validScore = Math.max(0, parseFloat(score.toFixed(2)))

        await prisma.usersOnRanklists.update({
            where: {
                userId_ranklistId: {
                    userId,
                    ranklistId,
                },
            },
            data: {score: validScore},
        })
        revalidatePath(`/admin/ranklists/${ranklistId}/edit`)
        return {success: true}
    } catch (error) {
        console.error(error)
        return {success: false, error: 'Failed to update user score'}
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

export async function getAvailableUsers(ranklistId: string, search: string, page: number = 1) {
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
            OR: [
                {name: {contains: search, mode: 'insensitive' as const}},
                {email: {contains: search, mode: 'insensitive' as const}},
                {username: {contains: search, mode: 'insensitive' as const}},
            ],
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    image: true,
                },
                skip,
                take,
                orderBy: {
                    name: 'asc',
                },
            }),
            prisma.user.count({where}),
        ])

        return {
            success: true,
            users,
            total,
            pages: Math.ceil(total / take),
            currentPage: validPage
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            users: [],
            total: 0,
            pages: 1,
            currentPage: 1,
            error: 'Failed to fetch available users'
        }
    }
}



// Add these new functions to your existing actions.ts file

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