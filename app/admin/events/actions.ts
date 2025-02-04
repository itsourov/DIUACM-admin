// app/admin/events/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils/pagination";
import { buildSearchQuery } from "@/lib/utils/search";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PaginationParams } from "@/types/base";
import { EventFormData, eventFormSchema } from "@/app/admin/events/schema";



export async function getEventsAction(params: PaginationParams = {}) {
    const { skip, take, page } = getPaginationParams(params);

    const where: Prisma.EventWhereInput = params.search
        ? buildSearchQuery(params.search, ['title', 'description'])
        : {};

    const [events, total] = await Promise.all([
        prisma.event.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        }),
        prisma.event.count({ where }),
    ]);

    return {
        data: events,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
    };
}

export async function getEventAction(id: string) {
    return prisma.event.findUnique({
        where: { id },
    });
}


export async function createEventAction(_: string, values: EventFormData) {
    try {
        const validatedFields = eventFormSchema.parse(values);

        // Values are already in UTC ISO string format from the client
        const data = {
            ...validatedFields,
            startDateTime: new Date(validatedFields.startDateTime),
            endDateTime: new Date(validatedFields.endDateTime),
        };

        await prisma.event.create({ data });

        revalidatePath("/admin/events");
        return { success: "Event created successfully" };
    } catch (error) {
        console.error('Create event error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to create event" };
    }
}

export async function updateEventAction(id: string, values: EventFormData) {
    if (!id) {
        return { error: "Event ID is required" };
    }

    try {
        const validatedFields = eventFormSchema.parse(values);

        // Values are already in UTC ISO string format from the client
        const data = {
            ...validatedFields,
            startDateTime: new Date(validatedFields.startDateTime),
            endDateTime: new Date(validatedFields.endDateTime),
        };

        await prisma.event.update({
            where: { id },
            data,
        });

        revalidatePath("/admin/events");
        return { success: "Event updated successfully" };
    } catch (error) {
        console.error('Update event error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to update event" };
    }
}

export async function deleteEventAction(id: string) {
    try {
        await prisma.event.delete({
            where: { id },
        });
        revalidatePath("/admin/events");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete event " + error };
    }
}