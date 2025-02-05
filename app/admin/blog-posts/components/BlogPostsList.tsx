'use client';

import { BlogPost } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/app/admin/components/shared/DataTable/DataTable";
import { deleteBlogPostAction } from "@/app/admin/blog-posts/actions";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface BlogPostsListProps {
    posts: BlogPost[];
    totalPages: number;
    currentPage: number;
}

const STATUS_VARIANTS = {
    PUBLISHED: 'success',
    DRAFT: 'secondary',
    PRIVATE: 'default'
} as const;

export function BlogPostsList({ posts, totalPages, currentPage }: BlogPostsListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteBlogPostAction(id);
            if (result.success) {
                toast.success('Blog post deleted successfully');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete blog post');
            }
        } catch (error) {
            toast.error(`An error occurred while deleting the blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const columns = [
        {
            header: 'Title',
            accessorKey: 'title' as const,
            cell: (post: BlogPost) => (
                <div className="flex items-center gap-2">
                    {post.featuredImage && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Has featured image</TooltipContent>
                        </Tooltip>
                    )}
                    <div className="font-medium max-w-[300px] truncate" title={post.title}>
                        {post.title}
                    </div>
                </div>
            ),
        },
        {
            header: 'Author',
            accessorKey: 'author' as const,
            cell: (post: BlogPost) => (
                <div className="text-sm" title={post.author}>
                    {post.author}
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status' as const,
            cell: (post: BlogPost) => (
                <Badge
                    variant={STATUS_VARIANTS[post.status] || 'default'}
                    className="capitalize"
                >
                    {post.status.toLowerCase()}
                </Badge>
            ),
        },
        {
            header: 'Published',
            accessorKey: 'publishedAt' as const,
            cell: (post: BlogPost) => (
                <div className="text-sm text-muted-foreground">
                    {formatDate(post.publishedAt)}
                </div>
            ),
        },
        {
            header: 'Last Updated',
            accessorKey: 'updatedAt' as const,
            cell: (post: BlogPost) => (
                <div className="text-sm text-muted-foreground">
                    {formatDate(post.updatedAt)}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as const,
            cell: (post: BlogPost) => (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.push(`/admin/blog-posts/${post.id}/edit`)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit post</TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Delete post</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{post.title}&quot;?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <DataTable
                data={posts}
                columns={columns}
                totalPages={totalPages}
                currentPage={currentPage}
                searchPlaceholder="Search blog posts by title or content..."
                onCreate={() => router.push('/admin/blog-posts/new')}
            />
        </div>
    );
}