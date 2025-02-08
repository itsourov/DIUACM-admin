'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import { revalidatePath } from 'next/cache';

export async function markAttendance(eventId: string, password: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('You must be logged in to mark attendance');
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (!event.openForAttendance) {
        throw new Error('Attendance is not open for this event');
    }

    if (event.contestPassword !== password) {
        throw new Error('Invalid password');
    }

    const now = new Date();
    if (now < new Date(event.startDateTime) || now > new Date(event.endDateTime)) {
        throw new Error('Event is not currently active');
    }

    try {
        await prisma.eventAttendance.create({
            data: {
                userId: session.user.id,
                eventId,
            }
        });

        revalidatePath(`/events/${eventId}`);
        return { success: true };
    } catch (error) {
        console.log(error);
        throw new Error('You have already marked attendance for this event');
    }
}
