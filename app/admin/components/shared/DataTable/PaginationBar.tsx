// components/shared/DataTable/PaginationBar.tsx
'use client';

import { Button } from "@/components/ui/button";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
} from "lucide-react";

interface PaginationBarProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function PaginationBar({
                                  totalPages,
                                  currentPage,
                                  onPageChange,
                              }: PaginationBarProps) {
    // Generate page numbers to show
    const getPageNumbers = () => {
        const delta = 2; // Number of pages to show on each side
        const range = [];
        for (
            let i = Math.max(1, currentPage - delta);
            i <= Math.min(totalPages, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        // Add first page if it's not in range
        if (range[0] > 1) {
            if (range[0] > 2) {
                range.unshift(-1); // Add ellipsis
            }
            range.unshift(1);
        }

        // Add last page if it's not in range
        if (range[range.length - 1] < totalPages) {
            if (range[range.length - 1] < totalPages - 1) {
                range.push(-1); // Add ellipsis
            }
            range.push(totalPages);
        }

        return range;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(1)}
                disabled={currentPage <= 1}
            >
                <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeftIcon className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
                {pageNumbers.map((pageNumber, index) => (
                    pageNumber === -1 ? (
                        <div key={`ellipsis-${index}`} className="px-3 py-2">...</div>
                    ) : (
                        <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    )
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage >= totalPages}
            >
                <ChevronsRightIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}