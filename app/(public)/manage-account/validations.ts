import * as z from "zod"

export const profileSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),
    email: z.string()
        .email("Please enter a valid email address"),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username cannot exceed 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and dashes"),
    phone: z.string()
        .regex(/^\d{11}$/, "Phone number must be exactly 11 digits")
        .nullable(),
    gender: z.enum(["male", "female", "other", "unspecified"])
        .default("unspecified"),
    // New fields with proper optional validation
    codeforcesHandle: z.string().optional().nullable(),
    atcoderHandle: z.string().optional().nullable(),
    vjudgeHandle: z.string().optional().nullable(),
    startingSemester: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    studentId: z.string().optional().nullable(),
})

export type ProfileFormData = z.infer<typeof profileSchema>