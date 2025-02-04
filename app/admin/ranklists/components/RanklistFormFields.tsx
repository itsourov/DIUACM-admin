'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RanklistFormData } from "../schema";

export function RanklistFormFields() {
    const form = useFormContext<RanklistFormData>();

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {/* Title Field */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter ranklist title"
                                    {...field}
                                    value={field.value ?? ''}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Keyword Field */}
                <FormField
                    control={form.control}
                    name="keyword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Keyword <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter unique keyword"
                                    {...field}
                                    value={field.value ?? ''}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormDescription>
                                A unique identifier for the ranklist. Use only letters, numbers, hyphens, and underscores.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}