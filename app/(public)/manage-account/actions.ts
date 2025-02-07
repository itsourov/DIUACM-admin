"use server"

import { z } from "zod"
import { profileSchema } from './validations'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { s3Service } from "@/lib/s3"

export type FieldErrors = {
    name?: string;
    email?: string;
    username?: string;
    phone?: string;
    gender?: string;
    image?: string;
    codeforcesHandle?: string;
    atcoderHandle?: string;
    vjudgeHandle?: string;
    startingSemester?: string;
    department?: string;
    studentId?: string;
};

export type ActionResponse<T> = {
    success: boolean;
    user?: T;
    error?: string;
    errors?: FieldErrors;
};

export async function updateProfileImage(
    imageData: string
): Promise<ActionResponse<{ imageUrl: string }>> {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return {
                success: false,
                error: "Unauthorized"
            };
        }

        const buffer = Buffer.from(
            imageData.replace(/^data:image\/\w+;base64,/, ''),
            'base64'
        );

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { image: true }
        });

        // Delete old image if exists
        if (currentUser?.image) {
            try {
                // Extract key from the full URL
                const urlParts = currentUser.image.split('/');
                const key = urlParts[urlParts.length - 1];
                if (key) {
                    await s3Service.deleteFile(key);
                }
            } catch (error) {
                console.error('Failed to delete old image:', error);
            }
        }

        // Upload new image
        const { url } = await s3Service.uploadFile(
            buffer,
            `${userId}-profile.jpg`,
            'image/jpeg',
            {
                folder: 'profile-images',
                maxSizeMB: 5,
                generateUniqueFilename: true,
                allowedFileTypes: ['image/jpeg', 'image/png'],
                metadata: {
                    uploadedBy: userId,
                    uploadedAt: new Date().toISOString(),
                }
            }
        );

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                image: url,
                updatedAt: new Date(),
            },
        });

        revalidatePath('/manage-account');

        return {
            success: true,
            user: {
                imageUrl: user.image || '' // Handle potential undefined with fallback
            }
        };

    } catch (error) {
        console.error('Image upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to upload image"
        };
    }
}

export async function updateProfile(formData: z.infer<typeof profileSchema>) {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return {
                success: false,
                error: "Unauthorized"
            };
        }

        const validatedData = profileSchema.parse(formData);

        const errors: FieldErrors = {};

        const existingUserByEmail = await prisma.user.findFirst({
            where: {
                email: validatedData.email,
                NOT: {
                    id: userId
                }
            }
        });

        if (existingUserByEmail) {
            errors.email = "Email already taken";
        }

        const existingUserByUsername = await prisma.user.findFirst({
            where: {
                username: validatedData.username,
                NOT: {
                    id: userId
                }
            }
        });

        if (existingUserByUsername) {
            errors.username = "Username already taken";
        }

        if (Object.keys(errors).length > 0) {
            return {
                errors,
                success: false
            };
        }

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: validatedData.name,
                email: validatedData.email,
                username: validatedData.username.toLowerCase(),
                phone: validatedData.phone ?? null, // Handle potential undefined
                gender: validatedData.gender ?? null, // Handle potential undefined
                codeforcesHandle: validatedData.codeforcesHandle ?? null,
                atcoderHandle: validatedData.atcoderHandle ?? null,
                vjudgeHandle: validatedData.vjudgeHandle ?? null,
                startingSemester: validatedData.startingSemester ?? null,
                department: validatedData.department ?? null,
                studentId: validatedData.studentId ?? null,
                updatedAt: new Date(),
            },
        });

        revalidatePath('/manage-account');

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name || '',
                email: user.email || '',
                username: user.username || '',
                phone: user.phone || '',
                gender: user.gender || '',
                codeforcesHandle: user.codeforcesHandle || '',
                atcoderHandle: user.atcoderHandle || '',
                vjudgeHandle: user.vjudgeHandle || '',
                startingSemester: user.startingSemester || '',
                department: user.department || '',
                studentId: user.studentId || ''
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