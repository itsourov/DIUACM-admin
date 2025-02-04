import { z } from 'zod';
import { Ranklist } from '@prisma/client';

export const ranklistFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    keyword: z.string().min(1, "Keyword is required")
        .regex(/^[a-zA-Z0-9-_]+$/, "Keyword can only contain letters, numbers, hyphens, and underscores"),
});

export type RanklistFormData = z.infer<typeof ranklistFormSchema>;

export interface RanklistFormProps {
    initialData?: Ranklist | null;
    action: (id: string, data: RanklistFormData) => Promise<{ success?: string; error?: string }>;
    isEditing: boolean;
    ranklistId?: string;
}