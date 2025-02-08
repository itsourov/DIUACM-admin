// app/events/types.ts
export type EventType = 'CLASS' | 'CONTEST' | 'MEETING' | 'ALL';

export interface EventsSearchParams {
    query?: string | null;
    type?: EventType | null;
    startDate?: string | null;
    endDate?: string | null;
    page?: number;
}