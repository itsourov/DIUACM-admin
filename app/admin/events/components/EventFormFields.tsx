// app/admin/events/components/EventFormFields.tsx

'use client';

import { useFormContext } from 'react-hook-form';
import { EventStatus, EventType, AttendanceScope } from '@prisma/client';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { EventFormData } from "@/app/admin/events/schema";

const EVENT_TYPES = Object.values(EventType);
const EVENT_STATUSES = Object.values(EventStatus);
const ATTENDANCE_SCOPES = Object.values(AttendanceScope);

export function EventFormFields() {
    const form = useFormContext<EventFormData>();
    const { watch } = form;
    const eventType = watch('type');

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Title Field */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter event title"
                                    {...field}
                                    value={field.value ?? ''}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Type Field */}
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {EVENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Start Date Time Field */}
                <FormField
                    control={form.control}
                    name="startDateTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date & Time <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="datetime-local"
                                    {...field}
                                    value={field.value ?? ''}
                                    className="cursor-pointer"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* End Date Time Field */}
                <FormField
                    control={form.control}
                    name="endDateTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date & Time <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="datetime-local"
                                    {...field}
                                    value={field.value ?? ''}
                                    className="cursor-pointer"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status Field */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {EVENT_STATUSES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Attendance Scope Field */}
                <FormField
                    control={form.control}
                    name="attendanceScope"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attendance Scope <span className="text-red-500">*</span></FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select scope" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {ATTENDANCE_SCOPES.map((scope) => (
                                        <SelectItem key={scope} value={scope}>
                                            {scope.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Determines who can mark attendance for this event
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Contest Details Section */}
            {eventType === 'CONTEST' && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="contestLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contest Link</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://contest-platform.com/contest"
                                                {...field}
                                                value={field.value ?? ''}
                                                type="url"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            The URL where participants can access the contest
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contestPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contest Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Contest access password"
                                                {...field}
                                                value={field.value ?? ''}
                                                type="text"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Password required to join the contest (if any)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}



            {/* Description Field */}
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Provide a detailed description of the event..."
                                className="min-h-[120px] resize-y"
                                {...field}
                                value={field.value ?? ''}
                            />
                        </FormControl>
                        <FormDescription>
                            Include important details about the event, requirements, and any special instructions
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Attendance Toggle */}
            <FormField
                control={form.control}
                name="openForAttendance"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">
                                Open for Attendance
                            </FormLabel>
                            <FormDescription>
                                Allow participants to mark their attendance for this event
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}