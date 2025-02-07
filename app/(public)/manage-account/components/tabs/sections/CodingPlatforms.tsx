// app/manage-account/components/tabs/sections/CodingPlatforms.tsx
import { Code } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { FormField } from '../../common/FormField'
import { cn } from "@/lib/utils"
import type { UseFormReturn } from 'react-hook-form'
import type { ProfileFormData } from '../../../validations'

interface CodingPlatformsProps {
    form: UseFormReturn<ProfileFormData>;
}

export function CodingPlatforms({ form }: CodingPlatformsProps) {
    const { register, formState: { errors } } = form

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    <span>Coding Platform Handles</span>
                </div>
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    label="Codeforces Handle"
                    icon={null}
                    error={errors.codeforcesHandle?.message}
                >
                    <Input
                        {...register('codeforcesHandle')}
                        className={cn(
                            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        )}
                        placeholder="Your Codeforces handle"
                    />
                </FormField>

                <FormField
                    label="AtCoder Handle"
                    icon={null}
                    error={errors.atcoderHandle?.message}
                >
                    <Input
                        {...register('atcoderHandle')}
                        className={cn(
                            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        )}
                        placeholder="Your AtCoder handle"
                    />
                </FormField>

                <FormField
                    label="VJudge Handle"
                    icon={null}
                    error={errors.vjudgeHandle?.message}
                >
                    <Input
                        {...register('vjudgeHandle')}
                        className={cn(
                            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        )}
                        placeholder="Your VJudge handle"
                    />
                </FormField>
            </div>
        </div>
    )
}