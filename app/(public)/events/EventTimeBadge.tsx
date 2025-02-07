import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

interface EventTimeBadgeProps {
    startDateTime: Date
    endDateTime: Date
}

export default function EventTimeBadge({ startDateTime, endDateTime }: EventTimeBadgeProps) {
    const now = new Date()
    const start = new Date(startDateTime)
    const end = new Date(endDateTime)

    let status: 'upcoming' | 'ongoing' | 'ended'
    let label: string

    if (now < start) {
        status = 'upcoming'
        const days = Math.floor((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (days === 0) {
            const hours = Math.floor((start.getTime() - now.getTime()) / (1000 * 60 * 60))
            label = hours <= 1 ? 'Starting soon' : `In ${hours} hours`
        } else {
            label = days === 1 ? 'Tomorrow' : `In ${days} days`
        }
    } else if (now >= start && now <= end) {
        status = 'ongoing'
        label = 'Ongoing'
    } else {
        status = 'ended'
        label = 'Ended'
    }

    const styles = {
        upcoming: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        ongoing: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300 border-green-200 dark:border-green-800',
        ended: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 dark:from-gray-900/40 dark:to-gray-800/40 dark:text-gray-300 border-gray-200 dark:border-gray-800'
    }

    return (
        <Badge variant="secondary" className={`${styles[status]} border shadow-sm`}>
            <Clock className="w-3 h-3 mr-1" />
            {label}
        </Badge>
    )
}