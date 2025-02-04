// app/admin/events/components/EventsList.tsx

'use client';

import { Event } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
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
import { deleteEventAction } from "@/app/admin/events/actions";
import { Edit2, Trash2, CalendarDays } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DateTime } from '@/lib/utils/datetime';

interface EventsListProps {
    events: Event[];
    totalPages: number;
    currentPage: number;
}

const TYPE_VARIANTS = {
    CONTEST: 'default',
    CLASS: 'outline',
    MEETING: 'secondary'
} as const;

export function EventsList({ events, totalPages, currentPage }: EventsListProps) {
    const router = useRouter();
    const userTimezone = DateTime.getUserTimezone();
    const timezoneOffset = DateTime.formatTimezoneOffset();

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteEventAction(id);
            if (result.success) {
                toast.success('Event deleted successfully');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete event');
            }
        } catch (error) {
            toast.error(`An error occurred while deleting the event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const columns = [
        {
            header: 'Title',
            accessorKey: 'title' as const,
            cell: (event: Event) => (
                <div className="font-medium max-w-[200px] truncate" title={event.title}>
                    {event.title}
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status' as const,
            cell: (event: Event) => (
                <Badge
                    variant="default"
                    className={event.status === 'PUBLISHED' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                    {event.status.toLowerCase()}
                </Badge>
            ),
        },
        {
            header: 'Type',
            accessorKey: 'type' as const,
            cell: (event: Event) => (
                <Badge
                    variant={TYPE_VARIANTS[event.type] || 'default'}
                    className="capitalize"
                >
                    {event.type.toLowerCase()}
                </Badge>
            ),
        },
        {
            header: 'Date & Time',
            accessorKey: 'startDateTime' as const,
            cell: (event: Event) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <div className="grid gap-0.5">
                                <div className="text-sm">
                                    {DateTime.formatDisplay(event.startDateTime)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    to {DateTime.formatDisplay(event.endDateTime)}
                                </div>
                            </div>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="w-auto p-2">
                        <div className="grid gap-1">
                            <div className="text-xs font-semibold">Time Zones:</div>
                            <div className="text-xs">
                                Your timezone: {userTimezone} ({timezoneOffset})
                            </div>
                            <div className="text-xs">
                                Start: {DateTime.formatDisplay(event.startDateTime, { format: 'utc', includeTimezone: true })}
                            </div>
                            <div className="text-xs">
                                End: {DateTime.formatDisplay(event.endDateTime, { format: 'utc', includeTimezone: true })}
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as const,
            cell: (event: Event) => (
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit event</TooltipContent>
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
                            <TooltipContent>Delete event</TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{event.title}&quot;?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(event.id)}
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
                data={events}
                columns={columns}
                totalPages={totalPages}
                currentPage={currentPage}
                searchPlaceholder="Search events by title..."
                onCreate={() => router.push('/admin/events/new')}
            />
        </div>
    );
}