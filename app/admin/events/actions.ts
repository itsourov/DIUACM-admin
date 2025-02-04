// app/admin/events/actions.ts
"use server";

import {prisma} from "@/lib/prisma";
import {getPaginationParams} from "@/lib/utils/pagination";
import {buildSearchQuery} from "@/lib/utils/search";

import {Prisma} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {PaginationParams} from "@/types/base";



export async function getEventsAction(params: PaginationParams = {}) {

    const {skip, take, page} = getPaginationParams(params);

    const where: Prisma.EventWhereInput = params.search
        ? buildSearchQuery(params.search, ['title', 'description'])
        : {};

    const [events, total] = await Promise.all([
        prisma.event.findMany({
            where,
            orderBy: {createdAt: 'desc'},
            skip,
            take,
        }),
        prisma.event.count({where}),
    ]);

    return {
        data: events,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
    };
}

export async function deleteEventAction(id: string) {
    try {
        await prisma.event.delete({
            where: {id},
        });
        revalidatePath("/admin/events");
        return {success: true};
    } catch (error) {
        return {success: false, error: "Failed to delete event " + error};
    }
}