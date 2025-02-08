// app/events/components/Pagination.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent } from "@/components/ui/pagination";

type PaginationProps = {
    totalPages: number;
    currentPage: number;
}

export default function PaginationComponent({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [loadingPage, setLoadingPage] = useState<number | null>(null);

    useEffect(() => {
        setLoadingPage(null);
    }, [searchParams, pathname]);

    const createQueryString = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return params.toString();
    }, [searchParams]);

    const handlePageChange = (page: number) => {
        if (page === currentPage || loadingPage !== null) return;
        setLoadingPage(page);
        router.push(`/events?${createQueryString(page)}`, { scroll: false });
    };

    const generatePageNumbers = (current: number, total: number) => {
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        if (current <= 3) {
            return [1, 2, 3, 4, 'ellipsis', total];
        }

        if (current >= total - 2) {
            return [1, 'ellipsis', total - 3, total - 2, total - 1, total];
        }

        return [
            1,
            'ellipsis',
            current - 1,
            current,
            current + 1,
            'ellipsis',
            total
        ];
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination className="w-full mt-8">
            <PaginationContent className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
                                        p-3 flex justify-between items-center gap-2
                                        hover:border-blue-500/50 dark:hover:border-blue-500/50
                                        transition-all duration-200
                                        hover:shadow-lg hover:shadow-blue-500/10">
                {/* Previous Button */}
                <button
                    onClick={() => {
                        if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                        }
                    }}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium",
                        "rounded-md transition-all duration-200",
                        "bg-gray-100 dark:bg-gray-900",
                        "border dark:border-gray-700",
                        "select-none",
                        currentPage <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : loadingPage === currentPage - 1
                                ? "opacity-70"
                                : "hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer",
                        "text-gray-700 dark:text-gray-200"
                    )}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1.5">
                    <code className="text-xs text-gray-600 dark:text-gray-400 sm:hidden px-2">
                        {currentPage}/{totalPages}
                    </code>
                    <div className="hidden sm:flex items-center space-x-1.5">
                        {generatePageNumbers(currentPage, totalPages).map((page, index) => {
                            if (page === 'ellipsis') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        •••
                                    </span>
                                );
                            }

                            const isCurrentPage = page === currentPage;
                            const isLoadingThisPage = loadingPage === page;

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page as number)}
                                    className={cn(
                                        "min-w-[32px] h-8 px-2 text-xs font-medium",
                                        "rounded-md transition-all duration-200",
                                        "border dark:border-gray-700",
                                        "select-none",
                                        isCurrentPage
                                            ? "bg-blue-500 text-white border-blue-500 dark:border-blue-500"
                                            : isLoadingThisPage
                                                ? "opacity-70"
                                                : cn(
                                                    "bg-gray-100 dark:bg-gray-900",
                                                    "text-gray-700 dark:text-gray-200",
                                                    "hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                                )
                                    )}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={() => {
                        if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                        }
                    }}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium",
                        "rounded-md transition-all duration-200",
                        "bg-gray-100 dark:bg-gray-900",
                        "border dark:border-gray-700",
                        "select-none",
                        currentPage >= totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : loadingPage === currentPage + 1
                                ? "opacity-70"
                                : "hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer",
                        "text-gray-700 dark:text-gray-200"
                    )}
                >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </PaginationContent>
        </Pagination>
    );
}