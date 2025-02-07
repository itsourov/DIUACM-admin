// app/manage-account/components/common/FormField.tsx
import type {LucideIcon} from 'lucide-react'
import React from "react";

interface FormFieldProps {
    label: string;
    icon: LucideIcon | null;
    error?: string;
    children: React.ReactNode;
    required?: boolean;
}

export function FormField({
                              label,
                              icon: Icon,
                              error,
                              children,
                              required
                          }: FormFieldProps){
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
                {label}
                {required && <span className="text-red-500" aria-hidden="true">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true"/>
                    </div>
                )}
                {children}
            </div>
            {error && (
                <p className="text-xs text-red-500 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}