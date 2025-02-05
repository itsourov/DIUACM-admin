'use client';

import { useState, useCallback } from 'react';
import { RelationManager } from '@/components/many-to-many/relation-manager';
import {
    attachEventToRanklist,
    detachEventFromRanklist,
    updateEventWeight,
    getEvents,
} from '../actions';
import { Event, EventPivot, EventWithPivot } from '../types';
import { PaginatedResult } from '@/types/many-to-many';

interface EventManagerProps {
    ranklistId: string;
    initialEvents: EventWithPivot[];
    initialAvailableEvents: PaginatedResult<Event>;
}

export function EventManager({
                                 ranklistId,
                                 initialEvents,
                                 initialAvailableEvents,
                             }: EventManagerProps) {
    const [selectedEvents, setSelectedEvents] =
        useState<EventWithPivot[]>(initialEvents);
    const [availableEvents, setAvailableEvents] =
        useState<PaginatedResult<Event>>(initialAvailableEvents);

    const config = {
        title: 'Events',
        pivotFields: [
            {
                key: 'weight' as const,
                label: 'Weight',
                type: 'number' as const,
                defaultValue: 0.5,
                validation: {
                    required: true,
                    min: 0.0,
                    max: 1.0,
                    step: 0.1,
                    precision: 1,
                }
            },
            {
                key: 'updatedAt' as const,
                label: 'Last Updated',
                type: 'date' as const,
                defaultValue: new Date(),
                readonly: true,
            },
            {
                key: 'updatedBy' as const,
                label: 'Updated By',
                type: 'text' as const,
                defaultValue: 'system',
                readonly: true,
            }
        ],
        searchPlaceholder: 'Search events by title...'
    };

    const handlePaginate = useCallback(async (page: number) => {
        const result = await getEvents({ page });
        setAvailableEvents(result);
    }, []);

    const handleSearch = useCallback(async (search: string, page: number) => {
        const result = await getEvents({ page, search });
        setAvailableEvents(result);
    }, []);

    const handleAttach = async (eventId: string, pivotData: EventPivot) => {
        const result = await attachEventToRanklist(ranklistId, eventId, pivotData.weight);
        if (result.success) {
            const newEvent = availableEvents.items.find(e => e.id === eventId);
            if (newEvent) {
                setSelectedEvents(prev => [...prev, {
                    ...newEvent,
                    pivot: {
                        weight: pivotData.weight,
                        updatedAt: new Date(),
                        updatedBy: 'system',
                    }
                }]);
                setAvailableEvents(prev => ({
                    ...prev,
                    items: prev.items.filter(e => e.id !== eventId)
                }));
            }
        }
        return result;
    };

    const handleDetach = async (eventId: string) => {
        const result = await detachEventFromRanklist(ranklistId, eventId);
        if (result.success) {
            const detachedEvent = selectedEvents.find(e => e.id === eventId);
            if (detachedEvent) {
                setSelectedEvents(prev => prev.filter(e => e.id !== eventId));
                if (availableEvents.page === 1) {
                    await handleSearch('', 1);
                }
            }
        }
        return result;
    };

    const handleUpdatePivot = async (eventId: string, pivotData: EventPivot) => {
        const result = await updateEventWeight(ranklistId, eventId, pivotData.weight);
        if (result.success) {
            setSelectedEvents(prev =>
                prev.map(e => e.id === eventId ? {
                    ...e,
                    pivot: {
                        weight: pivotData.weight,
                        updatedAt: new Date(),
                        updatedBy: 'system',
                    }
                } : e)
            );
        }
        return result;
    };

    return (
        <RelationManager<Event, EventPivot>
            sourceId={ranklistId}
            items={availableEvents.items}
            selectedItems={selectedEvents}
            config={config}
            onAttach={handleAttach}
            onDetach={handleDetach}
            onUpdatePivot={handleUpdatePivot}
            onPaginate={handlePaginate}
            onSearch={handleSearch}
            totalPages={availableEvents.totalPages}
            currentPage={availableEvents.page}
        />
    );
}