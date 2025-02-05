import { BaseItem, PivotData } from '@/types/many-to-many';

export interface Event extends BaseItem {
    id: string;
    title: string;
    description: string | null | undefined; // Update this to allow null
    startDateTime: Date;
    endDateTime: Date;
}

export interface EventPivot extends PivotData {
    weight: number;
    updatedAt: Date;
    updatedBy: string;
}

export type EventWithPivot = Event & {
    pivot: EventPivot;
};