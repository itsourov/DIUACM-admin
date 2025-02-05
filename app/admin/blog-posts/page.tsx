import { Metadata } from 'next';
import { getBlogPostsAction } from './actions';
import { BlogPostsList } from './components/BlogPostsList';

export const metadata: Metadata = {
    title: 'Blog Posts Management',
    description: 'Manage blog posts in the system',
};

interface BlogPostsPageProps {
    searchParams: {
        page?: string;
        search?: string;
    };
}

export default async function BlogPostsPage({ searchParams }: BlogPostsPageProps) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const search = searchParams.search || '';

    const { data: posts, totalPages, currentPage } = await getBlogPostsAction({
        page,
        search,
    });

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Blog Posts Management</h2>
                    <p className="text-muted-foreground">
                        Create and manage blog posts in the system
                    </p>
                </div>

                <BlogPostsList
                    posts={posts}
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}