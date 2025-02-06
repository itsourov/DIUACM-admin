// app/actions/auth.ts
"use server"

import {z} from "zod";
import {hash} from "bcryptjs";
import {prisma} from "@/lib/prisma";
import {registerSchema} from "@/lib/schemas/register";

export type FieldErrors = {
    email?: string;
    username?: string;
};

export async function registerUser(formData: z.infer<typeof registerSchema>) {
    try {
        // Validate form data
        const validatedData = registerSchema.parse(formData);

        const errors: FieldErrors = {};

        // Check if email already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: {email: validatedData.email}
        });

        if (existingUserByEmail) {
            errors.email = "Email already registered";
        }

        // Check if username already exists
        const existingUserByUsername = await prisma.user.findUnique({
            where: {username: validatedData.username}
        });

        if (existingUserByUsername) {
            errors.username = "Username already taken";
        }

        // If there are any errors, return them
        if (Object.keys(errors).length > 0) {
            return {
                errors,
                success: false
            };
        }

        // Hash password
        const hashedPassword = await hash(validatedData.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                username: validatedData.username.toLowerCase(),
                password: hashedPassword,
            },
        });

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message
            };
        }

        return {
            success: false,
            error: "An unexpected error occurred"
        };
    }
}