'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { RanklistFormFields } from './RanklistFormFields';
import { Loader2 } from 'lucide-react';
import { RanklistFormData, RanklistFormProps, ranklistFormSchema } from "../schema";

export function RanklistForm({
                                 initialData,
                                 action,
                                 isEditing,
                                 ranklistId = '',
                             }: RanklistFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RanklistFormData>({
        resolver: zodResolver(ranklistFormSchema),
        defaultValues: {
            title: initialData?.title ?? '',
            keyword: initialData?.keyword ?? '',
        },
    });

    const onSubmit = async (data: RanklistFormData) => {
        setIsSubmitting(true);
        try {
            const result = await action(ranklistId, data);
            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.success) {
                toast.success(result.success);
                router.push('/admin/ranklists');
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
                <RanklistFormFields />

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isDirty}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEditing ? 'Update' : 'Create'} Ranklist
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/ranklists')}
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