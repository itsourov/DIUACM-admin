'use client';

import { useFormContext } from 'react-hook-form';
import { BlogPostStatus } from '@prisma/client';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BlogPostFormData } from "../schema";
import { Card, CardContent } from '@/components/ui/card';

const POST_STATUSES = Object.values(BlogPostStatus);

export function BlogPostFormFields() {
    const form = useFormContext<BlogPostFormData>();

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
                                    placeholder="Enter blog post title"
                                    {...field}
                                    value={field.value ?? ''}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Author Field */}
                <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Author <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter author name"
                                    {...field}
                                    value={field.value ?? ''}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status Field */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {POST_STATUSES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Featured Image Field */}
                <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Featured Image</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="Enter image URL"
                                    {...field}
                                    value={field.value ?? ''}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormDescription>
                                Enter a URL for the featured image of this blog post
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Content Field */}
            <Card>
                <CardContent className="pt-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your blog post content..."
                                        className="min-h-[300px] resize-y font-mono"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}