import { AttendanceScope } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { Globe, Users, UserSquare2 } from 'lucide-react'

interface AttendanceScopeBadgeProps {
    scope: AttendanceScope
}

export default function AttendanceScopeBadge({ scope }: AttendanceScopeBadgeProps) {
    const config = {
        [AttendanceScope.PUBLIC]: {
            label: 'Public',
            icon: Globe,
            className: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 dark:from-green-900/40 dark:to-green-800/40 dark:text-green-300 border-green-200 dark:border-green-800'
        },
        [AttendanceScope.ONLY_GIRLS]: {
            label: 'Girls Only',
            icon: Users,
            className: 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-800 dark:from-pink-900/40 dark:to-pink-800/40 dark:text-pink-300 border-pink-200 dark:border-pink-800'
        },
        [AttendanceScope.JUNIOR_PROGRAMMERS]: {
            label: 'Junior',
            icon: UserSquare2,
            className: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 dark:from-yellow-900/40 dark:to-yellow-800/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
        }
    }

    const { label, icon: Icon, className } = config[scope]

    return (
        <Badge variant="secondary" className={className}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
        </Badge>
    )
}