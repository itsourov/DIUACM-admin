'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { Event, EventWithPivot } from "./types";
import { PaginatedResult } from "@/types/many-to-many";

interface GetEventsOptions {
    page?: number;
    limit?: number;
    search?: string;
}

export async function getRanklistWithEvents(ranklistId: string) {
    try {
        const prismaRanklist = await prisma.ranklist.findUnique({
            where: { id: ranklistId },
            select: {
                id: true,
                events: {
                    select: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                startDateTime: true,
                                endDateTime: true,
                            }
                        },
                        weight: true,
                        updatedAt: true,
                        updatedBy: true,
                    }
                }
            }
        });

        if (!prismaRanklist) {
            return { ranklist: null, selectedEvents: [] };
        }

        const selectedEvents: EventWithPivot[] = prismaRanklist.events.map(e => ({
            id: e.event.id,
            title: e.event.title,
            description: e.event.description,
            startDateTime: e.event.startDateTime,
            endDateTime: e.event.endDateTime,
            pivot: {
                weight: e.weight,
                updatedAt: e.updatedAt,
                updatedBy: e.updatedBy ?? 'system'
            }
        }));

        return {
            ranklist: prismaRanklist,
            selectedEvents
        };
    } catch (error) {
        console.error('Failed to get ranklist events:', error);
        return { ranklist: null, selectedEvents: [] };
    }
}

export async function getEvents({
                                    page = 1,
                                    limit = 10,
                                    search = ''
                                }: GetEventsOptions = {}): Promise<PaginatedResult<Event>> {
    try {
        const whereCondition: Prisma.EventWhereInput = search ? {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        } : {};

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where: whereCondition,
                orderBy: { startDateTime: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    startDateTime: true,
                    endDateTime: true,
                }
            }),
            prisma.event.count({ where: whereCondition })
        ]);

        return {
            items: events,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit)
        };
    } catch (error) {
        console.error('Failed to get events:', error);
        return {
            items: [],
            total: 0,
            page: 1,
            totalPages: 0,
            hasNextPage: false
        };
    }
}

export async function attachEventToRanklist(
    ranklistId: string,
    eventId: string,
    weight: number
): Promise<{ success: boolean; error?: string }> {
    try {
        const validWeight = Math.max(0, Math.min(1, Number(Number(weight).toFixed(1))));

        await prisma.eventsOnRanklists.create({
            data: {
                eventId,
                ranklistId,
                weight: validWeight,
                updatedBy: 'system',
            },
        });

        revalidatePath(`/admin/ranklists/${ranklistId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to attach event:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to attach event' };
    }
}

export async function detachEventFromRanklist(
    ranklistId: string,
    eventId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.eventsOnRanklists.delete({
            where: {
                eventId_ranklistId: {
                    eventId,
                    ranklistId,
                }
            },
        });

        revalidatePath(`/admin/ranklists/${ranklistId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to detach event:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to detach event' };
    }
}

export async function updateEventWeight(
    ranklistId: string,
    eventId: string,
    weight: number
): Promise<{ success: boolean; error?: string }> {
    try {
        const validWeight = Math.max(0, Math.min(1, Number(Number(weight).toFixed(1))));

        await prisma.eventsOnRanklists.update({
            where: {
                eventId_ranklistId: {
                    eventId,
                    ranklistId,
                }
            },
            data: {
                weight: validWeight,
                updatedBy: 'system',
            },
        });

        revalidatePath(`/admin/ranklists/${ranklistId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update weight:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update weight' };
    }
}