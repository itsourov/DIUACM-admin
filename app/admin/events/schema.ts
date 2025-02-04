// app/admin/events/schema.ts
import { z } from "zod";

export const eventSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "PRIVATE"]),
    startDateTime: z.string().transform(str => new Date(str)),
    endDateTime: z.string().transform(str => new Date(str)),
    contestLink: z.string().optional(),
    contestPassword: z.string().optional(),
    openForAttendance: z.string().transform(str => str === 'true'),
    type: z.enum(["CLASS", "CONTEST", "MEETING"]),
    attendanceScope: z.enum(["PUBLIC", "ONLY_GIRLS", "JUNIOR_PROGRAMMERS"]),

});
export type EventFormData = z.infer<typeof eventSchema>;
