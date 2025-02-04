// lib/utils/date.ts
export function formatDateForInput(date: Date | string): string {
    return new Date(date).toISOString().slice(0, 16);
}

export function formatDateTime(date: Date | string): string {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}


export function formatUTCDateTime(date: Date): string {
    return date.toISOString()
        .replace('T', ' ')
        .substring(0, 19);
}

export function parseUTCDateTime(dateStr: string): Date {
    return new Date(dateStr.replace(' ', 'T') + 'Z');
}

export function getCurrentUTCDateTime(): string {
    return formatUTCDateTime(new Date());
}