'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { BlogPostFormFields } from './BlogPostFormFields';
import { Loader2 } from 'lucide-react';
import { BlogPostFormData, BlogPostFormProps, blogPostFormSchema } from "../schema";

export function BlogPostForm({
                                 initialData,
                                 action,
                                 isEditing,
                                 postId = '',
                             }: BlogPostFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<BlogPostFormData>({
        resolver: zodResolver(blogPostFormSchema),
        defaultValues: {
            title: initialData?.title ?? '',
            content: initialData?.content ?? '',
            author: initialData?.author ?? '',
            status: initialData?.status ?? 'DRAFT',
            publishedAt: initialData?.publishedAt
                ? new Date(initialData.publishedAt).toISOString()
                : null,
            featuredImage: initialData?.featuredImage ?? null,
        },
    });

    const onSubmit = async (data: BlogPostFormData) => {
        setIsSubmitting(true);
        try {
            const result = await action(postId, data);
            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.success) {
                toast.success(result.success);
                router.push('/admin/blog-posts');
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
                <BlogPostFormFields />

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isDirty}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEditing ? 'Update' : 'Create'} Blog Post
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/blog-posts')}
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