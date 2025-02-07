import { EventType } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Trophy, Users } from 'lucide-react'

interface EventTypeBadgeProps {
    type: EventType
}

export default function EventTypeBadge({ type }: EventTypeBadgeProps) {
    const config = {
        [EventType.CLASS]: {
            label: 'Class',
            icon: BookOpen,
            className: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 dark:from-purple-900/40 dark:to-purple-800/40 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        },
        [EventType.CONTEST]: {
            label: 'Contest',
            icon: Trophy,
            className: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 dark:from-orange-900/40 dark:to-orange-800/40 dark:text-orange-300 border-orange-200 dark:border-orange-800'
        },
        [EventType.MEETING]: {
            label: 'Meeting',
            icon: Users,
            className: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        }
    }

    const { label, icon: Icon, className } = config[type]

    return (
        <Badge variant="secondary" className={className}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
        </Badge>
    )
}