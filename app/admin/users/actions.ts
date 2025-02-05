// app/admin/users/actions.ts

"use server";

import {prisma} from "@/lib/prisma";
import {getPaginationParams} from "@/lib/utils/pagination";
import {buildSearchQuery} from "@/lib/utils/search";
import {Prisma} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {PaginationParams} from "@/types/base";
import {UserFormData, userFormSchema} from "@/app/admin/users/schema";
import * as bcrypt from 'bcryptjs';

export async function getUsersAction(params: PaginationParams = {}) {
    const {skip, take, page} = getPaginationParams(params);

    const where: Prisma.UserWhereInput = params.search
        ? buildSearchQuery(params.search, ['name', 'email', 'username'])
        : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: {createdAt: 'desc'},
            skip,
            take,
        }),
        prisma.user.count({where}),
    ]);

    return {
        data: users,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
    };
}

export async function getUserAction(id: string) {
    return prisma.user.findUnique({
        where: {id},
    });
}

export async function createUserAction(_: string, values: UserFormData) {
    try {
        const validatedFields = userFormSchema.parse(values);

        // Hash password if provided
        const hashedPassword = validatedFields.password
            ? await bcrypt.hash(validatedFields.password, 10)
            : null;

        await prisma.user.create({
            data: {
                ...validatedFields,
                password: hashedPassword,
            },
        });

        revalidatePath("/admin/users");
        return {success: "User created successfully"};
    } catch (error) {
        console.error('Create user error:', error);
        if (error instanceof Error) {
            return {error: error.message};
        }
        return {error: "Failed to create user"};
    }
}

export async function updateUserAction(id: string, values: UserFormData) {
    if (!id) {
        return {error: "User ID is required"};
    }

    try {
        const validatedFields = userFormSchema.parse(values);

        // Only update password if a new one is provided
        const data: Prisma.UserUpdateInput = {...validatedFields};

        if (!validatedFields.password) {
            delete data.password;
        } else {
            data.password = await bcrypt.hash(validatedFields.password, 10);
        }

        await prisma.user.update({
            where: {id},
            data,
        });

        revalidatePath("/admin/users");
        return {success: "User updated successfully"};
    } catch (error) {
        console.error('Update user error:', error);
        if (error instanceof Error) {
            return {error: error.message};
        }
        return {error: "Failed to update user"};
    }
}

export async function deleteUserAction(id: string) {
    try {
        await prisma.user.delete({
            where: {id},
        });
        revalidatePath("/admin/users");
        return {success: true};
    } catch (error) {
        return {success: false, error: "Failed to delete user " + error};
    }
}