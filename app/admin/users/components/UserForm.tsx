// app/admin/users/components/UserForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { UserFormFields } from './UserFormFields';
import { Loader2 } from 'lucide-react';
import {GenderType, UserFormData, UserFormProps, userFormSchema} from "../schema";

export function UserForm({
                             initialData,
                             action,
                             isEditing,
                             userId = '',
                         }: UserFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            email: initialData?.email ?? '',
            username: initialData?.username ?? '',
            password: '',
            gender: (initialData?.gender as GenderType) ?? null,
            phone: initialData?.phone ?? '',
            codeforcesHandle: initialData?.codeforcesHandle ?? '',
            atcoderHandle: initialData?.atcoderHandle ?? '',
            vjudgeHandle: initialData?.vjudgeHandle ?? '',
            startingSemester: initialData?.startingSemester ?? '',
            department: initialData?.department ?? '',
            studentId: initialData?.studentId ?? '',
            image: initialData?.image ?? '',
        },
    });

    const onSubmit = async (data: UserFormData) => {
        setIsSubmitting(true);
        try {
            const result = await action(userId, data);
            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.success) {
                toast.success(result.success);
                router.push('/admin/users');
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
                <UserFormFields />

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isDirty}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEditing ? 'Update' : 'Create'} User
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/users')}
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