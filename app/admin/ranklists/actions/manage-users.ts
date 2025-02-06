import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

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

