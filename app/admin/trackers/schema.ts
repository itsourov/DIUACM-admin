import { z } from 'zod';
import { Tracker } from '@prisma/client';

export const trackerFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
});

export type TrackerFormData = z.infer<typeof trackerFormSchema>;

export interface TrackerFormProps {
    initialData?: Tracker | null;
    action: (id: string, data: TrackerFormData) => Promise<{ success?: string; error?: string }>;
    isEditing: boolean;
    trackerId?: string;
}