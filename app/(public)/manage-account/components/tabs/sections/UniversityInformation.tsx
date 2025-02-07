// app/manage-account/components/tabs/sections/UniversityInformation.tsx
import { School } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { FormField } from '../../common/FormField'
import { cn } from "@/lib/utils"
import type { UseFormReturn } from 'react-hook-form'
import type { ProfileFormData } from '../../../validations'

interface UniversityInformationProps {
    form: UseFormReturn<ProfileFormData>;
}

export function UniversityInformation({ form }: UniversityInformationProps) {
    const { register, formState: { errors } } = form

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    <span>University Information</span>
                </div>
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    label="Starting Semester"
                    icon={null}
                    error={errors.startingSemester?.message}
                >
                    <Input
                        {...register('startingSemester')}
                        className={cn(
                            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        )}
                        placeholder="e.g., Fall 2023"
                    />
                </FormField>

                <FormField
                    label="Department"
                    icon={null}
                    error={errors.department?.message}
                >
                    <Input
                        {...register('department')}
                        className={cn(
                            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        )}
                        placeholder="e.g., Computer Science & Engineering"
                    />
                </FormField>

                <FormField
                    label="Student ID"
                    icon={null}
                    error={errors.studentId?.message}
                >
                    <Input
                        {...register('studentId')}
                        className={cn(
                            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        )}
                        placeholder="Your student ID"
                    />
                </FormField>
            </div>
        </div>
    )
}