import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BlogPostForm } from "../components/BlogPostForm";
import { createBlogPostAction } from "../actions";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Blog Post',
    description: 'Create a new blog post in the system',
};

export default function NewBlogPostPage() {
    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Blog Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogPostForm
                        action={createBlogPostAction}
                        isEditing={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}