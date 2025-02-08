import { AttendanceScope, EventType } from '@prisma/client';

export const getScopeConfig = (scope: AttendanceScope) => {
    switch (scope) {
        case 'PUBLIC':
            return {
                icon: '👥',
                label: 'Open for All',
                description: 'This event is open to all participants',
                class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            };
        case 'ONLY_GIRLS':
            return {
                icon: '👩',
                label: 'Girls Only',
                description: 'This event is exclusively for female participants',
                class: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
            };
        case 'JUNIOR_PROGRAMMERS':
            return {
                icon: '🌱',
                label: 'Junior Devs',
                description: 'This event is for junior developers',
                class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            };
    }
};

export const getTypeConfig = (type: EventType) => {
    switch (type) {
        case 'CLASS':
            return {
                icon: '📚',
                label: 'Class',
                description: 'Educational session or workshop',
                class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
            };
        case 'CONTEST':
            return {
                icon: '🏆',
                label: 'Contest',
                description: 'Competitive programming contest',
                class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            };
        case 'MEETING':
            return {
                icon: '👥',
                label: 'Meeting',
                description: 'Group discussion or meetup',
                class: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
            };
    }
};
