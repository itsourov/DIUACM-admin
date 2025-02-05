import { z } from 'zod';
import { BlogPost, BlogPostStatus } from '@prisma/client';

export const blogPostFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    author: z.string().min(1, "Author is required"),
    status: z.nativeEnum(BlogPostStatus),
    publishedAt: z.string().nullable().optional(),
    featuredImage: z.string().nullable().optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

export interface BlogPostFormProps {
    initialData?: BlogPost | null;
    action: (id: string, data: BlogPostFormData) => Promise<{ success?: string; error?: string }>;
    isEditing: boolean;
    postId?: string;
}