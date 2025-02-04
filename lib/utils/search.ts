// lib/utils/search.ts
export function buildSearchQuery(search: string, fields: string[]) {
    if (!search) return {};

    const searchTerms = search.split(' ').filter(Boolean);

    return {
        OR: searchTerms.map(term => ({
            OR: fields.map(field => ({
                [field]: {
                    contains: term,
                    mode: 'insensitive' as const,
                },
            })),
        })),
    };
}