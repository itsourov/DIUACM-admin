import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {notFound} from 'next/navigation';
import {BlogPostForm} from "../../components/BlogPostForm";
import {getBlogPostAction, updateBlogPostAction} from "../../actions";

interface EditBlogPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({params}: EditBlogPostPageProps) {
    // Wait for params to resolve
    const resolvedParams = await params;
    const post = await getBlogPostAction(resolvedParams.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle>Edit Blog Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogPostForm
                        initialData={post}
                        action={updateBlogPostAction}
                        isEditing={true}
                        postId={resolvedParams.id}
                    />
                </CardContent>
            </Card>
        </div>
    );
}