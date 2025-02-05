"use server";

import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils/pagination";
import { buildSearchQuery } from "@/lib/utils/search";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PaginationParams } from "@/types/base";
import { TrackerFormData, trackerFormSchema } from "@/app/admin/trackers/schema";

export async function getTrackersAction(params: PaginationParams = {}) {
    const { skip, take, page } = getPaginationParams(params);

    const where: Prisma.TrackerWhereInput = params.search
        ? buildSearchQuery(params.search, ['title', 'description'])
        : {};

    const [trackers, total] = await Promise.all([
        prisma.tracker.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take,
            include: {
                _count: {
                    select: {
                        ranklists: true
                    }
                }
            }
        }),
        prisma.tracker.count({ where }),
    ]);

    return {
        data: trackers,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
    };
}

export async function getTrackerAction(id: string) {
    return prisma.tracker.findUnique({
        where: { id },
    });
}

export async function createTrackerAction(_: string, values: TrackerFormData) {
    try {
        const validatedFields = trackerFormSchema.parse(values);

        await prisma.tracker.create({
            data: validatedFields
        });

        revalidatePath("/admin/trackers");
        return { success: "Tracker created successfully" };
    } catch (error) {
        console.error('Create tracker error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to create tracker" };
    }
}

export async function updateTrackerAction(id: string, values: TrackerFormData) {
    if (!id) {
        return { error: "Tracker ID is required" };
    }

    try {
        const validatedFields = trackerFormSchema.parse(values);

        await prisma.tracker.update({
            where: { id },
            data: validatedFields,
        });

        revalidatePath("/admin/trackers");
        return { success: "Tracker updated successfully" };
    } catch (error) {
        console.error('Update tracker error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to update tracker" };
    }
}

export async function deleteTrackerAction(id: string) {
    try {
        await prisma.tracker.delete({
            where: { id },
        });
        revalidatePath("/admin/trackers");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete tracker " + error };
    }
}