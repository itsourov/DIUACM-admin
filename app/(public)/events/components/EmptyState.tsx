// app/events/components/EmptyState.tsx
import {CalendarX} from 'lucide-react';
import React from "react";

type EmptyStateProps = {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
};

export default function EmptyState({
                                       title = "No Events Found",
                                       message = "We couldn't find any events matching your criteria. Try adjusting your filters or search terms.",
                                       icon = <CalendarX className="w-12 h-12 text-gray-400"/>
                                   }: EmptyStateProps) {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700
                      bg-white dark:bg-gray-800/50 p-8 text-center">
            <div className="mx-auto flex max-w-md flex-col items-center justify-center">
                {icon}
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {message}
                </p>
            </div>
        </div>
    );
}