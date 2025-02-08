// app/events/components/EventSearchForm.tsx
'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

import { EventType } from '../types';

const EVENT_TYPES: { value: EventType; label: string }[] = [
    { value: 'ALL', label: 'All Types' },
    { value: 'CLASS', label: 'Class' },
    { value: 'CONTEST', label: 'Contest' },
    { value: 'MEETING', label: 'Meeting' },
];

export default function EventSearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL parameters
    const [search, setSearch] = useState(searchParams.get('query') || '');
    const [type, setType] = useState<EventType>((searchParams.get('type') as EventType) || 'ALL');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null,
        searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null
    ]);
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebounce(search, 300);

    const createQueryString = useCallback((params: Record<string, string | null>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) =>
            value === null ? newSearchParams.delete(key) : newSearchParams.set(key, value));
        return newSearchParams.toString();
    }, [searchParams]);

    // Update URL when search changes
    useEffect(() => {
        const currentSearchValue = searchParams.get('query') || '';
        if (debouncedSearch !== currentSearchValue) {
            const newQueryString = createQueryString({
                query: debouncedSearch || null,
                page: '1'
            });
            router.push(`/events?${newQueryString}`, { scroll: false });
        }
    }, [debouncedSearch, router, createQueryString, searchParams]);


    const handleTypeChange = (newType: EventType) => {
        setType(newType);
        const queryString = createQueryString({
            type: newType === 'ALL' ? null : newType,
            page: '1'
        });
        router.push(`/events?${queryString}`, { scroll: false });
    };

    const resetFilters = () => {
        setType('ALL');
        setDateRange([null, null]);
        const queryString = createQueryString({
            type: null,
            startDate: null,
            endDate: null,
            page: '1'
        });
        router.push(`/events?${queryString}`, { scroll: false });
    };

    const clearSearch = () => {
        setSearch('');
        const queryString = createQueryString({
            query: null,
            page: '1'
        });
        router.push(`/events?${queryString}`, { scroll: false });
    };

    const hasActiveFilters = type !== 'ALL' || dateRange[0] || dateRange[1];
    const hasAnyFilters = hasActiveFilters || search;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                      transition-all duration-200
                      hover:border-blue-500/50 dark:hover:border-blue-500/50
                      hover:shadow-lg hover:shadow-blue-500/10">
            <div className="p-4">
                {/* Search Bar and Filter Toggle */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900
                                   border border-gray-200 dark:border-gray-700 rounded-lg
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                   text-sm text-gray-900 dark:text-white"
                        />
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                                       hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-lg border transition-all
                            ${hasActiveFilters
                            ? 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        title="Toggle filters"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                    <div className="mt-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Event Type Filter */}
                            <div className="w-full sm:w-1/3">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                                    Event Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => handleTypeChange(e.target.value as EventType)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900
                                           border border-gray-200 dark:border-gray-700 rounded-lg
                                           focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                           text-sm text-gray-900 dark:text-white cursor-pointer"
                                >
                                    {EVENT_TYPES.map((eventType) => (
                                        <option key={eventType.value} value={eventType.value}>
                                            {eventType.label}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>

                        {hasAnyFilters && (
                            <div className="flex justify-end">
                                <button
                                    onClick={resetFilters}
                                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500
                                           dark:hover:text-red-400 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}