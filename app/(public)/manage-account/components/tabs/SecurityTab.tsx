"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff, KeyRound, Shield } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField } from '../common/FormField'
import { cn } from "@/lib/utils"
import { passwordSchema, type PasswordFormData } from '../../validations/password-schema'
import { updatePassword } from '../../actions/update-password'
import type { User } from "@prisma/client"

interface SecurityTabProps {
    user: User
}

export default function SecurityTab({ user }: SecurityTabProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const { register, formState: { errors }, reset } = form

    const onSubmit = async (data: PasswordFormData) => {
        try {
            setIsLoading(true)
            const result = await updatePassword(data)

            if (result.success) {
                toast.success(user.password
                    ? "Password updated successfully"
                    : "Password set successfully"
                )
                reset()
            } else {
                toast.error(result.error || "Failed to update password")
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
            console.error('Password update error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-8">
            <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.password
                        ? "Update your password to keep your account secure."
                        : "Set up a password for your account."}
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {user.password && (
                    <FormField
                        label="Current Password"
                        icon={KeyRound}
                        error={errors.currentPassword?.message}
                        required
                    >
                        <div className="relative">
                            <Input
                                {...register('currentPassword')}
                                type={showCurrentPassword ? 'text' : 'password'}
                                className={cn(
                                    "pl-9 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    errors.currentPassword && "border-red-500 dark:border-red-500 focus:ring-red-500"
                                )}
                                placeholder="Enter your current password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                    </FormField>
                )}

                <FormField
                    label="New Password"
                    icon={Lock}
                    error={errors.newPassword?.message}
                    required
                >
                    <div className="relative">
                        <Input
                            {...register('newPassword')}
                            type={showNewPassword ? 'text' : 'password'}
                            className={cn(
                                "pl-9 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                errors.newPassword && "border-red-500 dark:border-red-500 focus:ring-red-500"
                            )}
                            placeholder="Enter your new password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                            {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                            )}
                        </Button>
                    </div>
                </FormField>

                <FormField
                    label="Confirm New Password"
                    icon={Lock}
                    error={errors.confirmPassword?.message}
                    required
                >
                    <div className="relative">
                        <Input
                            {...register('confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={cn(
                                "pl-9 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                errors.confirmPassword && "border-red-500 dark:border-red-500 focus:ring-red-500"
                            )}
                            placeholder="Confirm your new password"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                            )}
                        </Button>
                    </div>
                </FormField>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full sm:w-auto",
                            "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
                            "text-white font-medium",
                            "flex items-center justify-center gap-2",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <Lock className="h-4 w-4 animate-pulse" />
                                <span>
                                    {user.password ? "Updating Password..." : "Setting Password..."}
                                </span>
                            </>
                        ) : (
                            <>
                                <Lock className="h-4 w-4" />
                                <span>
                                    {user.password ? "Update Password" : "Set Password"}
                                </span>
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20 p-4">
                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                            Password Requirements
                        </h4>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                            <li>At least 8 characters long</li>
                            <li>Must contain at least one letter</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}