// app/admin/ranklists/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils/pagination";
import { buildSearchQuery } from "@/lib/utils/search";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PaginationParams } from "@/types/base";
import { RanklistFormData, ranklistFormSchema } from "@/app/admin/ranklists/schema";

export async function getRanklistsAction(params: PaginationParams = {}) {
    const { skip, take, page } = getPaginationParams(params);

    const where: Prisma.RanklistWhereInput = params.search
        ? buildSearchQuery(params.search, ['title', 'keyword'])
        : {};

    const [ranklists, total] = await Promise.all([
        prisma.ranklist.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        }),
        prisma.ranklist.count({ where }),
    ]);

    return {
        data: ranklists,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
    };
}


export async function createRanklistAction(_: string, values: RanklistFormData) {
    try {
        const validatedFields = ranklistFormSchema.parse(values);

        // Check if keyword already exists
        const existing = await prisma.ranklist.findUnique({
            where: { keyword: validatedFields.keyword },
        });

        if (existing) {
            return { error: "A ranklist with this keyword already exists" };
        }

        await prisma.ranklist.create({ data: validatedFields });

        revalidatePath("/admin/ranklists");
        return { success: "Ranklist created successfully" };
    } catch (error) {
        console.error('Create ranklist error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to create ranklist" };
    }
}

export async function updateRanklistAction(id: string, values: RanklistFormData) {
    if (!id) {
        return { error: "Ranklist ID is required" };
    }

    try {
        const validatedFields = ranklistFormSchema.parse(values);

        // Check if keyword already exists on another ranklist
        const existing = await prisma.ranklist.findFirst({
            where: {
                keyword: validatedFields.keyword,
                NOT: { id }
            },
        });

        if (existing) {
            return { error: "A ranklist with this keyword already exists" };
        }

        await prisma.ranklist.update({
            where: { id },
            data: validatedFields,
        });

        revalidatePath("/admin/ranklists");
        return { success: "Ranklist updated successfully" };
    } catch (error) {
        console.error('Update ranklist error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to update ranklist" };
    }
}

export async function deleteRanklistAction(id: string) {
    try {
        await prisma.ranklist.delete({
            where: { id },
        });
        revalidatePath("/admin/ranklists");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete ranklist " + error };
    }
}