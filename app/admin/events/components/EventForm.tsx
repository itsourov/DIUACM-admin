'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { EventFormFields } from './EventFormFields';
import { Loader2 } from 'lucide-react';
import {
    EventFormData,
    EventFormProps,
    eventFormSchema
} from "@/app/admin/events/schema";
import { DateTime } from '@/lib/utils/datetime';
import { QuickFillContestModal } from './QuickFillContestModal';
import { decodeHTMLEntities } from '@/lib/utils/html';

export function EventForm({
                              initialData,
                              action,
                              isEditing = false,
                              eventId = '',
                          }: EventFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userTimezone = DateTime.getUserTimezone();

    // Initialize form with default values
    const form = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: decodeHTMLEntities(initialData?.title ?? ''),
            description: initialData?.description ?? '',
            status: initialData?.status ?? 'DRAFT',
            // Convert UTC dates to local for form inputs
            startDateTime: initialData?.startDateTime
                ? DateTime.utcToLocalInput(initialData.startDateTime)
                : DateTime.utcToLocalInput(new Date().toISOString()),
            endDateTime: initialData?.endDateTime
                ? DateTime.utcToLocalInput(initialData.endDateTime)
                : DateTime.utcToLocalInput(new Date(Date.now() + 3600000).toISOString()),
            contestLink: initialData?.contestLink ?? '',
            contestPassword: initialData?.contestPassword ?? '',
            openForAttendance: initialData?.openForAttendance ?? false,
            type: initialData?.type ?? 'CONTEST',
            attendanceScope: initialData?.attendanceScope ?? 'PUBLIC',
        },
    });

    const onSubmit = async (data: EventFormData) => {
        setIsSubmitting(true);
        try {
            // Ensure dates are in UTC ISO format for server
            const submissionData = {
                ...data,
                startDateTime: DateTime.localInputToUTC(data.startDateTime).toISOString(),
                endDateTime: DateTime.localInputToUTC(data.endDateTime).toISOString(),
            };

            const result = await action(eventId, submissionData);
            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.success) {
                toast.success(result.success);
                router.push('/admin/events');
                router.refresh();
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <QuickFillContestModal
                onFill={(data) => {
                    form.reset({
                        ...data,
                        title: decodeHTMLEntities(data.title),
                        // Convert UTC dates to local for form inputs
                        startDateTime: DateTime.utcToLocalInput(data.startDateTime),
                        endDateTime: DateTime.utcToLocalInput(data.endDateTime),
                    });
                }}
                isEditing={isEditing}
            />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">
                        All times are shown in your local timezone:
                        <span className="font-semibold ml-1">
                            {userTimezone} ({DateTime.formatTimezoneOffset()})
                        </span>
                    </div>
                    <div className="text-muted-foreground/80 text-xs">
                        Times will be automatically converted when saving
                    </div>
                </div>

                <EventFormFields />

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        {isEditing ? 'Update' : 'Create'} Event
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/events')}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}