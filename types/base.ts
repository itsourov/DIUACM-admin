// types/base.ts
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginationParams {
    page?: number;
    perPage?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
}