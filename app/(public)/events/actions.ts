// app/events/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { EventsSearchParams } from './types';

export async function getEvents(params: EventsSearchParams) {
    const page = params.page || 1;
    const perPage = 10;

    const where = {
        AND: [
            params.query ? {
                OR: [
                    { title: { contains: params.query, mode: Prisma.QueryMode.insensitive } },
                    { description: { contains: params.query, mode: Prisma.QueryMode.insensitive } }
                ]
            } : {},
            params.type && params.type !== 'ALL' ? { type: params.type } : {},
            params.startDate && params.endDate ? {
                startDateTime: {
                    gte: new Date(params.startDate),
                    lte: new Date(params.endDate)
                }
            } : {}
        ]
    };

    const [events, totalCount] = await Promise.all([
        prisma.event.findMany({
            where,
            orderBy: { startDateTime: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.event.count({ where })
    ]);

    return {
        events,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page
    };
}