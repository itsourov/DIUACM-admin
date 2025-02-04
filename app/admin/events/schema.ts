// app/admin/events/schema.ts

import { z } from 'zod';
import { Event, EventStatus, EventType, AttendanceScope } from '@prisma/client';
import { DateTime } from '@/lib/utils/datetime';

export const eventFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    status: z.nativeEnum(EventStatus),
    startDateTime: z.string().min(1, "Start date is required"),
    endDateTime: z.string().min(1, "End date is required"),
    contestLink: z.string().optional().nullable(),
    contestPassword: z.string().optional().nullable(),
    openForAttendance: z.boolean(),
    type: z.nativeEnum(EventType),
    attendanceScope: z.nativeEnum(AttendanceScope),
}).refine(
    (data) => {
        return DateTime.isValid(data.startDateTime) &&
            DateTime.isValid(data.endDateTime) &&
            DateTime.compare(data.endDateTime, data.startDateTime) > 0;
    },
    {
        message: "End date must be after start date and dates must be valid",
        path: ["endDateTime"],
    }
);

export type EventFormData = z.infer<typeof eventFormSchema>;

export interface EventFormProps {
    initialData?: Event | null;
    action: (id: string, data: EventFormData) => Promise<{ success?: string; error?: string }>;
    isEditing: boolean;
    eventId?: string;
}