import * as z from "zod"

export const passwordSchema = z.object({
    currentPassword: z.string().optional(),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-zA-Z])/,
            "Password must contain at least one letter"
        ),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export type PasswordFormData = z.infer<typeof passwordSchema>