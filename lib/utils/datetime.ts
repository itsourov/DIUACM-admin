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
     * Converts a UTC ISO string or Date to local display format for inputs
     * Only use this in client components
     */
    static utcToLocalInput(utcDate: Date | string): string {
        const date = new Date(utcDate);
        if (!this.isValid(date)) return '';

        // Convert UTC to local time for display
        const localDate = new Date(date);
        return localDate.toLocaleDateString('en-CA') + 'T' +
            localDate.toLocaleTimeString('en-GB').slice(0, 5);
    }

    /**
     * Converts a local datetime input string to UTC Date
     * Use this when sending data to the server
     */
    static localInputToUTC(localDateString: string): Date {
        if (!localDateString) return new Date();

        const date = new Date(localDateString);
        if (!this.isValid(date)) return new Date();

        return date;
    }

    static getCurrentUTCTime(): Date {
        return new Date();
    }

    /**
     * Formats a UTC date for display in local timezone
     * Only use this in client components
     */
    static formatDisplay(date: Date | string, options: Partial<DateTimeOptions> = {}): string {
        const opts = { ...this.DEFAULT_OPTIONS, ...options };
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
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
            return 'UTC';
        }
    }

    static formatTimezoneOffset(): string {
        const offset = -new Date().getTimezoneOffset();
        const sign = offset >= 0 ? '+' : '-';
        const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
        const minutes = String(Math.abs(offset) % 60).padStart(2, '0');
        return `UTC${sign}${hours}:${minutes}`;
    }

    static isValid(date: Date | string): boolean {
        const dateObj = date instanceof Date ? date : new Date(date);
        return !isNaN(dateObj.getTime());
    }
}