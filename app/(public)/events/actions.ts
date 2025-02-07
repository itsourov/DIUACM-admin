'use server'

import {prisma} from '@/lib/prisma'
import {Prisma, EventStatus} from '@prisma/client'
import {EventsResponse} from './types'

export async function getEvents(
    page: number,
    search: string,
): Promise<EventsResponse | null> {
    try {
        const limit = 10
        const skip = (page - 1) * limit

        const conditions: Prisma.EventWhereInput[] = [
            {status: EventStatus.PUBLISHED},
        ]

        if (search) {
            conditions.push({
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive
                        }
                    },
                    {
                        description: {
                            contains: search,
                            mode: Prisma.QueryMode.insensitive
                        }
                    }
                ]
            })
        }

        const whereConditions: Prisma.EventWhereInput = {
            AND: conditions
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where: whereConditions,
                orderBy: {
                    startDateTime: 'desc'  // Changed from 'asc' to 'desc'
                },
                include: {
                    ranklists: {
                        include: {
                            ranklist: true
                        }
                    },
                    contestStats: true,
                    _count: {
                        select: {
                            contestStats: true
                        }
                    }
                },
                skip,
                take: limit,
            }),
            prisma.event.count({
                where: whereConditions
            })
        ])

        return {
            events,
            total,
            totalPages: Math.ceil(total / limit)
        }
    } catch (error: unknown) {
        // Type the error properly
        console.error('Error fetching events:', error instanceof Error ? error.message : error)
        return null
    }
}