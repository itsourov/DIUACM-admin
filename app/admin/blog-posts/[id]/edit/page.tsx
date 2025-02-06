import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { BlogPostForm } from "../../components/BlogPostForm";
import { getBlogPostAction, updateBlogPostAction } from "../../actions";


interface EditBlogPostPageProps {
    params: { id: string };
}



export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const post = await getBlogPostAction(params.id);

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
                        postId={params.id}
                    />
                </CardContent>
            </Card>
        </div>
    );
}