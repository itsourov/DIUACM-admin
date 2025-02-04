'use client';

import { Ranklist } from '@prisma/client';
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
import { deleteRanklistAction } from "@/app/admin/ranklists/actions";
import { Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RanklistsListProps {
    ranklists: Ranklist[];
    totalPages: number;
    currentPage: number;
}

export function RanklistsList({ ranklists, totalPages, currentPage }: RanklistsListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteRanklistAction(id);
            if (result.success) {
                toast.success('Ranklist deleted successfully');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete ranklist');
            }
        } catch (error) {
            toast.error(`An error occurred while deleting the ranklist: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const columns = [
        {
            header: 'Title',
            accessorKey: 'title' as const,
            cell: (ranklist: Ranklist) => (
                <div className="font-medium max-w-[200px] truncate" title={ranklist.title}>
                    {ranklist.title}
                </div>
            ),
        },
        {
            header: 'Keyword',
            accessorKey: 'keyword' as const,
            cell: (ranklist: Ranklist) => (
                <div className="font-mono text-sm">
                    {ranklist.keyword}
                </div>
            ),
        },
        {
            header: 'Created',
            accessorKey: 'createdAt' as const,
            cell: (ranklist: Ranklist) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(ranklist.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as const,
            cell: (ranklist: Ranklist) => (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.push(`/admin/ranklists/${ranklist.id}/edit`)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit ranklist</TooltipContent>
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
                            <TooltipContent>Delete ranklist</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Ranklist</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{ranklist.title}&quot;?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(ranklist.id)}
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
                data={ranklists}
                columns={columns}
                totalPages={totalPages}
                currentPage={currentPage}
                searchPlaceholder="Search ranklists by title or keyword..."
                onCreate={() => router.push('/admin/ranklists/new')}
            />
        </div>
    );
}