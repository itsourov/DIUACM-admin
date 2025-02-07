// app/manage-account/components/tabs/sections/BasicInformation.tsx
import { User2, Mail, Phone, AtSign } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormField } from '../../common/FormField'
import { cn } from "@/lib/utils"
import type { UseFormReturn } from 'react-hook-form'
import type { ProfileFormData } from '../../../validations'
import type { FieldErrors } from '../../../actions'

interface BasicInformationProps {
    form: UseFormReturn<ProfileFormData>;
    fieldErrors: FieldErrors;
}

export function BasicInformation({ form, fieldErrors }: BasicInformationProps) {
    const { register, formState: { errors }, watch, setValue } = form

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    label="Full Name"
                    icon={User2}
                    error={errors.name?.message}
                    required
                >
                    <Input
                        {...register('name')}
                        className={cn(
                            "pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                            errors.name && "border-red-500 dark:border-red-500 focus:ring-red-500"
                        )}
                        placeholder="John Doe"
                        aria-invalid={!!errors.name}
                    />
                </FormField>

                <FormField
                    label="Email Address"
                    icon={Mail}
                    error={errors.email?.message || fieldErrors.email}
                    required
                >
                    <Input
                        {...register('email')}
                        type="email"
                        className={cn(
                            "pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                            (errors.email || fieldErrors.email) && "border-red-500 dark:border-red-500 focus:ring-red-500"
                        )}
                        placeholder="you@example.com"
                        aria-invalid={!!(errors.email || fieldErrors.email)}
                    />
                </FormField>

                <FormField
                    label="Username"
                    icon={AtSign}
                    error={errors.username?.message || fieldErrors.username}
                    required
                >
                    <Input
                        {...register('username')}
                        className={cn(
                            "pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                            (errors.username || fieldErrors.username) && "border-red-500 dark:border-red-500 focus:ring-red-500"
                        )}
                        placeholder="username"
                        aria-invalid={!!(errors.username || fieldErrors.username)}
                    />
                </FormField>

                <FormField
                    label="Phone Number"
                    icon={Phone}
                    error={errors.phone?.message}
                >
                    <Input
                        {...register('phone')}
                        type="tel"
                        className={cn(
                            "pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                            errors.phone && "border-red-500 dark:border-red-500 focus:ring-red-500"
                        )}
                        placeholder="01XXXXXXXXX"
                        aria-invalid={!!errors.phone}
                    />
                </FormField>

                <FormField
                    label="Gender"
                    icon={null}
                    error={errors.gender?.message}
                >
                    <Select
                        value={watch('gender')}
                        onValueChange={(value) => setValue('gender', value as ProfileFormData['gender'])}
                    >
                        <SelectTrigger
                            className={cn(
                                "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                errors.gender && "border-red-500 dark:border-red-500 focus:ring-red-500"
                            )}
                        >
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <SelectItem value="unspecified">Not specified</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </FormField>
            </div>
        </div>
    )
}