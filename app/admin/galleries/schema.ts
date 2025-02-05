// app/admin/galleries/schema.ts
import { z } from 'zod';
import { Gallery, Image } from '@prisma/client';

export const imageSchema = z.object({
    url: z.string().url("Must be a valid URL"),
    key: z.string().min(1, "Key is required"),
    alt: z.string().optional().nullable(),
    order: z.number().int().default(0),
});

export const galleryFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    images: z.array(imageSchema).default([]),
});

export type GalleryFormData = z.infer<typeof galleryFormSchema>;

export interface GalleryWithImages extends Gallery {
    images: Image[];
}

export interface GalleryFormProps {
    initialData?: GalleryWithImages | null;
    action: (id: string, data: GalleryFormData) => Promise<{ success?: string; error?: string }>;
    isEditing: boolean;
    galleryId?: string;
}