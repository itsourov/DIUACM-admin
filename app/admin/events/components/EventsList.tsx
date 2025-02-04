// app/admin/events/EventsList.tsx
'use client';

import { Event } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/utils/date';
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
import {DataTable} from "@/app/admin/components/shared/DataTable/DataTable";
import {deleteEventAction} from "@/app/admin/events/actions";

interface EventsListProps {
    events: Event[];
    totalPages: number;
    currentPage: number;
}

export function EventsList({ events, totalPages, currentPage }: EventsListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteEventAction(id);
            if (result.success) {
                toast.success('Event deleted successfully');
                router.refresh();
            } else {
                toast.error('Failed to delete event');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the event. '+error);
        }
    };

    const columns = [
        {
            header: 'Title',
            accessorKey: 'title' as const,
        },
        {
            header: 'Status',
            accessorKey: 'status' as const,
            cell: (event: Event) => (
                <Badge
                    variant="default"
                    className={event.status === 'PUBLISHED' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                    {event.status}
                </Badge>
            ),
        },
        {
            header: 'Type',
            accessorKey: 'type' as const,
            cell: (event: Event) => (
                <Badge variant="outline">
                    {event.type}
                </Badge>
            ),
        },
        {
            header: 'Start Date',
            accessorKey: 'startDateTime' as const,
            cell: (event: Event) => formatDateTime(event.startDateTime),
        },
        {
            header: 'End Date',
            accessorKey: 'endDateTime' as const,
            cell: (event: Event) => formatDateTime(event.endDateTime),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as const,
            cell: (event: Event) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                    >
                        Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the event.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(event.id)}
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
        <DataTable
            data={events}
            columns={columns}
            totalPages={totalPages}
            currentPage={currentPage}
            searchPlaceholder="Search events..."
            onCreate={() => router.push('/admin/events/new')}
        />
    );
}