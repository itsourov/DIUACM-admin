// app/admin/events/components/EventForm.tsx

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
import { EventFormData, EventFormProps, eventFormSchema } from "@/app/admin/events/schema";
import { DateTime } from '@/lib/utils/datetime';

export function EventForm({
                              initialData,
                              action,
                              isEditing,
                              eventId = '',
                          }: EventFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userTimezone = DateTime.getUserTimezone();

    const form = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: initialData?.title ?? '',
            description: initialData?.description ?? '',
            status: initialData?.status ?? 'DRAFT',
            // Convert UTC dates to local for form inputs
            startDateTime: initialData?.startDateTime
                ? DateTime.utcToLocalInput(initialData.startDateTime)
                : DateTime.utcToLocalInput(DateTime.getCurrentUTCTime()),
            endDateTime: initialData?.endDateTime
                ? DateTime.utcToLocalInput(initialData.endDateTime)
                : DateTime.utcToLocalInput(new Date(DateTime.getCurrentUTCTime().getTime() + 3600000)), // +1 hour
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
            // Convert local datetime strings to UTC before sending to server
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="text-sm text-muted-foreground mb-4">
                    All times are shown in your local timezone: {userTimezone} ({DateTime.formatTimezoneOffset()})
                </div>

                <EventFormFields />

                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isDirty}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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