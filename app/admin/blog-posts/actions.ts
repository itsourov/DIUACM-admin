"use server";

import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils/pagination";
import { buildSearchQuery } from "@/lib/utils/search";
import { BlogPostStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PaginationParams } from "@/types/base";
import { BlogPostFormData, blogPostFormSchema } from "@/app/admin/blog-posts/schema";

export async function getBlogPostsAction(params: PaginationParams = {}) {
    const { skip, take, page } = getPaginationParams(params);

    const where: Prisma.BlogPostWhereInput = params.search
        ? buildSearchQuery(params.search, ['title', 'content', 'author'])
        : {};

    const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        }),
        prisma.blogPost.count({ where }),
    ]);

    return {
        data: posts,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
    };
}

export async function getBlogPostAction(id: string) {
    return prisma.blogPost.findUnique({
        where: { id },
    });
}

export async function createBlogPostAction(_: string, values: BlogPostFormData) {
    try {
        const validatedFields = blogPostFormSchema.parse(values);

        const data = {
            ...validatedFields,
            publishedAt: validatedFields.status === BlogPostStatus.PUBLISHED
                ? new Date()
                : validatedFields.publishedAt ? new Date(validatedFields.publishedAt) : null,
        };

        await prisma.blogPost.create({ data });

        revalidatePath("/admin/blog-posts");
        return { success: "Blog post created successfully" };
    } catch (error) {
        console.error('Create blog post error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to create blog post" };
    }
}

export async function updateBlogPostAction(id: string, values: BlogPostFormData) {
    if (!id) {
        return { error: "Blog post ID is required" };
    }

    try {
        const validatedFields = blogPostFormSchema.parse(values);
        const currentPost = await prisma.blogPost.findUnique({ where: { id } });

        if (!currentPost) {
            return { error: "Blog post not found" };
        }

        const data = {
            ...validatedFields,
            publishedAt: validatedFields.status === BlogPostStatus.PUBLISHED
                ? currentPost.publishedAt || new Date()
                : validatedFields.publishedAt ? new Date(validatedFields.publishedAt) : null,
        };

        await prisma.blogPost.update({
            where: { id },
            data,
        });

        revalidatePath("/admin/blog-posts");
        return { success: "Blog post updated successfully" };
    } catch (error) {
        console.error('Update blog post error:', error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to update blog post" };
    }
}

export async function deleteBlogPostAction(id: string) {
    try {
        await prisma.blogPost.delete({
            where: { id },
        });
        revalidatePath("/admin/blog-posts");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete blog post " + error };
    }
}