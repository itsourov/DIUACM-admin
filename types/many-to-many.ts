export interface BaseItem {
    id: string;
    title: string;
    [key: string]: unknown;
}

export type PivotFieldType = 'text' | 'number' | 'date';
export type PivotFieldValue = string | number | Date;

export interface PivotData {
    [key: string]: PivotFieldValue;
}

export interface PivotField<T extends PivotData> {
    key: keyof T;
    label: string;
    type: PivotFieldType;
    defaultValue: T[keyof T];
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: string;
        step?: number;
        precision?: number;
    };
    readonly?: boolean;
}

export interface RelationConfig<T extends PivotData> {
    title: string;
    pivotFields: PivotField<T>[];
    searchPlaceholder?: string;
}

export type ItemWithPivot<T extends BaseItem, P extends PivotData> = T & {
    pivot: P;
};

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
}