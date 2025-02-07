// app/manage-account/components/tabs/sections/FormActions.tsx
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { User } from "@prisma/client"
import {DateTime} from "@/lib/utils/datetime";

interface FormActionsProps {
    user: User;
    isLoading: boolean;
}

export function FormActions({ user, isLoading }: FormActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {user.updatedAt ? (
                <time dateTime={user.updatedAt.toISOString()}>
                    {DateTime.formatDisplay(user.updatedAt)}
                </time>
            ) : 'Never'}
            </p>
            <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                    "sm:w-auto w-full",
                    "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
                    "text-white font-medium",
                    "flex items-center justify-center gap-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Saving Changes...</span>
                    </>
                ) : (
                    'Save Changes'
                )}
            </Button>
        </div>
    )
}