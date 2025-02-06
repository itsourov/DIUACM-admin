import { PrismaClient, EventStatus, EventType, AttendanceScope } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface OldEvent {
    id: string;
    title: string;
    description: string | null;
    starting_time: string;
    ending_time: string;
    contest_link: string | null;
    password: string | null;
    open_for_attendance: string;
    type: string;
    visibility: string;
    organized_for: string;
    weight: string;
    result: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface JsonData {
    type: string;
    name?: string;
    database?: string;
    data?: OldEvent[];
}

async function main() {
    console.log('Starting to import events from JSON...');

    // Read the JSON file
    const jsonContent = fs.readFileSync(
        path.join(process.cwd(), 'old-data', 'events.json'),
        'utf-8'
    );
    const jsonData: JsonData[] = JSON.parse(jsonContent);

    // Find the table data
    const tableData = jsonData.find(item => item.type === 'table' && item.name === 'events');
    if (!tableData || !tableData.data) {
        throw new Error('No events data found in JSON file');
    }

    const events = tableData.data;
    console.log(`Found ${events.length} events to import`);

    // Process events in batches
    const BATCH_SIZE = 100;
    for (let i = 0; i < events.length; i += BATCH_SIZE) {
        const batch = events.slice(i, i + BATCH_SIZE);

        const formattedEvents = batch.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            status: mapVisibilityToStatus(event.visibility),
            startDateTime: new Date(event.starting_time),
            endDateTime: new Date(event.ending_time),
            contestLink: event.contest_link,
            contestPassword: event.password,
            openForAttendance: event.open_for_attendance === '1',
            type: mapEventType(event.type),
            attendanceScope: mapAttendanceScope(event.organized_for),
            createdAt: new Date(event.created_at),
            updatedAt: new Date(event.updated_at)
        }));

        await prisma.event.createMany({
            data: formattedEvents,
            skipDuplicates: true,
        });

        console.log(`Imported events ${i + 1} to ${Math.min(i + BATCH_SIZE, events.length)}`);
    }
}

function mapVisibilityToStatus(visibility: string): EventStatus {
    switch (visibility.toLowerCase()) {
        case 'published':
            return EventStatus.PUBLISHED;
        case 'private':
            return EventStatus.PRIVATE;
        default:
            return EventStatus.DRAFT;
    }
}

function mapEventType(type: string): EventType {
    switch (type.toLowerCase()) {
        case 'contest':
            return EventType.CONTEST;
        case 'class':
            return EventType.CLASS;
        case 'meeting':
            return EventType.MEETING;
        default:
            return EventType.CONTEST;
    }
}

function mapAttendanceScope(organizedFor: string): AttendanceScope {
    switch (organizedFor.toLowerCase()) {
        case 'only-girls':
            return AttendanceScope.ONLY_GIRLS;
        case 'junior-programmers':
            return AttendanceScope.JUNIOR_PROGRAMMERS;
        default:
            return AttendanceScope.PUBLIC;
    }
}

main()
    .catch((e) => {
        console.error('Error during import:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });