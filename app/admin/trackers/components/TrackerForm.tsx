'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { TrackerFormFields } from './TrackerFormFields';
import { Loader2 } from 'lucide-react';
import { TrackerFormData, TrackerFormProps, trackerFormSchema } from "../schema";

export function TrackerForm({
                                initialData,
                                action,
                                isEditing,
                                trackerId = '',
                            }: TrackerFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<TrackerFormData>({
        resolver: zodResolver(trackerFormSchema),
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
        },
    });

    const onSubmit = async (data: TrackerFormData) => {
        setIsSubmitting(true);
        try {
            const result = await action(trackerId, data);
            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.success) {
                toast.success(result.success);
                router.push('/admin/trackers');
                router.refresh();
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TrackerFormFields />

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isDirty}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEditing ? 'Update' : 'Create'} Tracker
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/trackers')}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}