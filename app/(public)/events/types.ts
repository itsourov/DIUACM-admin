import type { Event, Ranklist, ContestStatOfUser, EventsOnRanklists } from '@prisma/client'

// Add explicit type exports
export type EventWithRelations = Event & {
    ranklists: (EventsOnRanklists & {
        ranklist: Ranklist
    })[]
    contestStats: ContestStatOfUser[]
    _count: {
        contestStats: number
    }
}

export interface EventsResponse {
    events: EventWithRelations[]
    total: number
    totalPages: number
}

export interface EventListProps {
    initialEvents: EventWithRelations[]
    totalPages: number
    currentPage: number
    totalEvents: number
    initialSearch: string
}

export interface SearchParams {
    page?: string
    q?: string
}