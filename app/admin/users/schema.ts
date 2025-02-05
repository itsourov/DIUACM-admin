// app/admin/users/schema.ts

import { z } from 'zod';
import { User } from '@prisma/client';

export const Gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER',
} as const;

export type GenderType = typeof Gender[keyof typeof Gender];

export const userFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string()
        .optional()
        .nullable()
        .refine((val) => !val || val.length >= 6, {
            message: "Password must be at least 6 characters",
        }),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional().nullable(),
    phone: z.string().optional().nullable(),
    codeforcesHandle: z.string().optional().nullable(),
    atcoderHandle: z.string().optional().nullable(),
    vjudgeHandle: z.string().optional().nullable(),
    startingSemester: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    studentId: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export interface UserFormProps {
    initialData?: Partial<User> | null;
    action: (id: string, data: UserFormData) => Promise<{ success?: string; error?: string }>;
    isEditing: boolean;
    userId?: string;
}