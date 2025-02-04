// lib/utils/pagination.ts
import { PaginationParams } from '@/types/base';

export const DEFAULT_PAGE_SIZE = 10;

export function getPaginationParams(params: PaginationParams) {
    const page = Math.max(Number(params.page) || 1, 1);
    const perPage = Number(params.perPage) || DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * perPage;

    return {
        skip,
        take: perPage,
        page,
    };
}