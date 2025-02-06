// lib/utils/datetime.ts

interface DateTimeOptions {
    includeSeconds?: boolean;
    includeTimezone?: boolean;
    format?: 'local' | 'utc' | 'input' | 'display';
}

export class DateTime {
    private static readonly DEFAULT_OPTIONS: DateTimeOptions = {
        includeSeconds: false,
        includeTimezone: true,
        format: 'display'
    };


    /**
     * Convert UTC date to local datetime string for form inputs
     */
    static utcToLocalInput(utcDate: Date | string): string {
        const date = new Date(utcDate);
        if (!this.isValid(date)) return '';

        // Convert UTC to local
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
    }

    static getCurrentUTCTime(): Date {
        return new Date();
    }
    /**
     * Convert local datetime string to UTC
     */
    static localInputToUTC(localDateString: string): Date {
        if (!localDateString) return new Date();

        // Create date object from local input
        const date = new Date(localDateString);

        // Convert to UTC
        const utcDate = new Date(
            date.getTime() + (date.getTimezoneOffset() * 60000)
        );

        return utcDate;
    }

    /**
     * Format a date for display in user's local timezone
     */
    static formatDisplay(date: Date | string, options: Partial<DateTimeOptions> = {}): string {
        const opts = {...this.DEFAULT_OPTIONS, ...options};
        const dateObj = new Date(date);

        if (!this.isValid(dateObj)) {
            console.error('Invalid date provided to formatDisplay:', date);
            return 'Invalid date';
        }

        try {
            const formatOptions: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: opts.format === 'utc' ? 'UTC' : undefined,
                timeZoneName: opts.includeTimezone ? 'shortOffset' : undefined,
            };

            return new Intl.DateTimeFormat(undefined, formatOptions).format(dateObj);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    }


    static getUserTimezone(): string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    static formatTimezoneOffset(date: Date = new Date()): string {
        const offset = -date.getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
        const minutes = String(Math.abs(offset) % 60).padStart(2, '0');
        return `UTC${sign}${hours}:${minutes}`;
    }

    static isValid(date: Date | string): boolean {
        const dateObj = date instanceof Date ? date : new Date(date);
        return !isNaN(dateObj.getTime());
    }

    static compare(date1: string | Date, date2: string | Date): number {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getTime() - d2.getTime();
    }
}