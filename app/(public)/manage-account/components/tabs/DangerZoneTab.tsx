"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertTriangle, Trash2, AlertOctagon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { deleteAccount } from '../../actions/delete-account'
import type { User } from "@prisma/client"
import {signOut} from "next-auth/react";

interface DangerZoneTabProps {
    user: User
}

export default function DangerZoneTab({ user }: DangerZoneTabProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteAccount = async () => {
        if (confirmText !== user.username) {
            toast.error("Username confirmation doesn't match")
            return
        }

        try {
            setIsLoading(true)
            const result = await deleteAccount(confirmText)

            if (result.success) {
                toast.success("Account deleted successfully")
                await signOut({ redirect: false })
                router.push('/')
                router.refresh()
            } else {
                toast.error(result.error || "Failed to delete account")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            console.error('Account deletion error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertOctagon className="h-5 w-5 text-red-500" />
                    Danger Zone
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    These actions are permanent and cannot be undone.
                </p>
            </div>

            <div className="space-y-6">
                {/* Delete Account Section */}
                <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="text-base font-medium text-red-900 dark:text-red-200">
                                    Delete Account
                                </h4>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                            </div>
                            <Button
                                type="button"
                                onClick={() => setIsDeleting(true)}
                                disabled={isLoading}
                                className={cn(
                                    "shrink-0",
                                    "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
                                    "text-white font-medium",
                                    "flex items-center gap-2",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </Button>
                        </div>

                        {/* Delete Confirmation */}
                        {isDeleting && (
                            <div className="mt-4 space-y-4">
                                <div className="rounded-md bg-red-100 dark:bg-red-900/40 p-4">
                                    <div className="flex">
                                        <div className="shrink-0">
                                            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                                Are you absolutely sure?
                                            </h3>
                                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                                <p>
                                                    This action cannot be undone. This will permanently delete your
                                                    account and remove all your data from our servers.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirm-delete"
                                        className="block text-sm font-medium text-red-700 dark:text-red-300"
                                    >
                                        Please type <span className="font-mono">{user.username}</span> to confirm
                                    </label>
                                    <Input
                                        id="confirm-delete"
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder="Enter your username"
                                        className={cn(
                                            "bg-white dark:bg-gray-800 border-red-300 dark:border-red-700",
                                            "focus:ring-2 focus:ring-red-500 focus:border-transparent",
                                            "placeholder:text-red-300 dark:placeholder:text-red-600"
                                        )}
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setIsDeleting(false)
                                            setConfirmText('')
                                        }}
                                        disabled={isLoading}
                                        className="text-gray-600 dark:text-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={confirmText !== user.username || isLoading}
                                        className={cn(
                                            "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
                                            "text-white font-medium",
                                            "flex items-center gap-2",
                                            "disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Trash2 className="h-4 w-4 animate-pulse" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="h-4 w-4" />
                                                Confirm Delete
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}