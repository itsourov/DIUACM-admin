'use client';

import { Tracker } from '@prisma/client';
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
import { deleteTrackerAction } from "@/app/admin/trackers/actions";
import { Edit2, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge";

interface TrackersListProps {
    trackers: (Tracker & {
        _count: {
            ranklists: number;
        };
    })[];
    totalPages: number;
    currentPage: number;
}

export function TrackersList({ trackers, totalPages, currentPage }: TrackersListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteTrackerAction(id);
            if (result.success) {
                toast.success('Tracker deleted successfully');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete tracker');
            }
        } catch (error) {
            toast.error(`An error occurred while deleting the tracker: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const columns = [
        {
            header: 'Title',
            accessorKey: 'title' as const,
            cell: (tracker: typeof trackers[0]) => (
                <div className="font-medium max-w-[200px] truncate" title={tracker.title}>
                    {tracker.title}
                </div>
            ),
        },
        {
            header: 'Description',
            accessorKey: 'description' as const,
            cell: (tracker: typeof trackers[0]) => (
                <div className="max-w-[300px] truncate" title={tracker.description || ''}>
                    {tracker.description || '-'}
                </div>
            ),
        },
        // {
        //     header: 'Ranklists',
        //     accessorKey: '_count.ranklists' as const,
        //     cell: (tracker: typeof trackers[0]) => (
        //         <Badge variant="secondary">
        //             {tracker._count.ranklists}
        //         </Badge>
        //     ),
        // },
        {
            header: 'Created',
            accessorKey: 'createdAt' as const,
            cell: (tracker: typeof trackers[0]) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(tracker.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as const,
            cell: (tracker: typeof trackers[0]) => (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.push(`/admin/trackers/${tracker.id}/edit`)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit tracker</TooltipContent>
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
                            <TooltipContent>Delete tracker</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Tracker</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{tracker.title}&quot;?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(tracker.id)}
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
                data={trackers}
                columns={columns}
                totalPages={totalPages}
                currentPage={currentPage}
                searchPlaceholder="Search trackers by title or description..."
                onCreate={() => router.push('/admin/trackers/new')}
            />
        </div>
    );
}