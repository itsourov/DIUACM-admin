// app/admin/galleries/components/GalleriesList.tsx
'use client';

import {Gallery, Image} from '@prisma/client';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
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
import {deleteGalleryAction} from "../actions";
import {Edit2, Trash2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import NextImage from "next/image";
import {DataTable} from "@/app/admin/components/shared/DataTable/DataTable";

interface GalleriesListProps {
    galleries: (Gallery & {
        images: Image[];
        _count: {
            images: number;
        };
    })[];
    totalPages: number;
    currentPage: number;
}

export function GalleriesList({galleries, totalPages, currentPage}: GalleriesListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteGalleryAction(id);
            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                toast.success('Gallery deleted successfully');
                router.refresh();
            }
        } catch (error) {
            toast.error('Failed to delete gallery. ' + error);
        }
    };

    const formatDate = (date: Date) => {
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
            cell: (gallery: typeof galleries[0]) => (
                <div className="flex items-center gap-4">
                    {gallery.images[0] && (
                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                            <NextImage
                                src={gallery.images[0].url}
                                alt={gallery.images[0].alt || gallery.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div>
                        <div className="font-medium">{gallery.title}</div>
                        {gallery.description && (
                            <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                                {gallery.description}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: 'Images',
            accessorKey: '_count' as const,
            cell: (gallery: typeof galleries[0]) => (
                <Badge variant="secondary" className="font-mono">
                    {gallery._count.images}
                </Badge>
            ),
        },
        {
            header: 'Created',
            accessorKey: 'createdAt' as const,
            cell: (gallery: typeof galleries[0]) => (
                <div className="text-sm text-muted-foreground">
                    {formatDate(gallery.createdAt)}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as const,
            cell: (gallery: typeof galleries[0]) => (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.push(`/admin/galleries/${gallery.id}/edit`)}
                            >
                                <Edit2 className="h-4 w-4"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit gallery</TooltipContent>
                    </Tooltip>

                    <AlertDialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Delete gallery</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Gallery</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{gallery.title}&quot;?
                                    This will also delete all {gallery._count.images} images in this gallery.
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(gallery.id)}
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
                data={galleries}
                columns={columns}
                totalPages={totalPages}
                currentPage={currentPage}
                searchPlaceholder="Search galleries by title or description..."
                onCreate={() => router.push('/admin/galleries/new')}
            />
        </div>
    );
}