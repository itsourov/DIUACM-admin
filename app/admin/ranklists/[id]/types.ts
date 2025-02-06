// app/admin/ranklists/[id]/types.ts
export type EventWithRelations = {
    id: string;
    title: string;
    startDateTime: Date;
    weight?: number;
};

export type UserWithRelations = {
    id: string;
    name: string;
    email: string;
    username: string;
    image?: string | null;
    score?: number;
};

export type TrackerWithRelations = {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
};