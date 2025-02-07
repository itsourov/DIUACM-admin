"use server"

import {auth} from "@/lib/auth"
import {prisma} from "@/lib/prisma"

export type DeleteAccountResponse = {
    success: boolean;
    error?: string;
}

export async function deleteAccount(username: string): Promise<DeleteAccountResponse> {
    try {
        const session = await auth()
        if (!session?.user) {
            return {
                success: false,
                error: "Unauthorized"
            }
        }

        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        })

        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }

        if (user.username !== username) {
            return {
                success: false,
                error: "Username confirmation doesn't match"
            }
        }

        // Delete the user and all related data
        await prisma.user.delete({
            where: {id: session.user.id}
        })

        return {success: true}
    } catch (error) {
        console.error('Account deletion error:', error)
        return {
            success: false,
            error: "Failed to delete account"
        }
    }
}