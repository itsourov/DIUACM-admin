"use client"

import {useState} from "react"
import type {LucideIcon} from "lucide-react"
import {User2, Shield, AlertTriangle} from "lucide-react"
import {type User} from "@prisma/client"
import {cn} from "@/lib/utils"

// Import tab components
import ProfileTab from './tabs/ProfileTab'
import SecurityTab from './tabs/SecurityTab'
import DangerZoneTab from './tabs/DangerZoneTab'

// Type Definitions
interface AccountTabsProps {
    user: User;
}

type TabId = 'profile' | 'security' | 'danger'

interface Tab {
    id: TabId;
    label: string;
    icon: LucideIcon;
    component: React.ComponentType<{ user: User }>;
    variant?: 'danger';
}

// Define tabs configuration
const tabs: Tab[] = [
    {
        id: 'profile',
        label: 'Profile',
        icon: User2,
        component: ProfileTab,
    },
    {
        id: 'security',
        label: 'Security',
        icon: Shield,
        component: SecurityTab,
    },
    {
        id: 'danger',
        label: 'Danger Zone',
        icon: AlertTriangle,
        component: DangerZoneTab,
        variant: 'danger'
    }
]

export default function AccountTabs({user}: AccountTabsProps) {
    const [activeTab, setActiveTab] = useState<TabId>('profile')

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div
                className="flex overflow-x-auto gap-2 p-1 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            type="button"
                            aria-selected={isActive}
                            role="tab"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium whitespace-nowrap",
                                "transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                                isActive
                                    ? tab.variant === 'danger'
                                        ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 focus:ring-red-500"
                                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 focus:ring-blue-500"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500"
                            )}
                        >
                            <tab.icon
                                className={cn(
                                    "w-4 h-4",
                                    isActive && tab.variant === 'danger'
                                        ? "text-red-500"
                                        : isActive
                                            ? "text-blue-500"
                                            : "text-gray-400 dark:text-gray-400"
                                )}
                                aria-hidden="true"
                            />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div
                className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                role="tabpanel"
                aria-label={`${activeTab} tab content`}
            >
                {tabs.map((tab) => (
                    activeTab === tab.id && (
                        <tab.component
                            key={tab.id}
                            user={user}
                        />
                    )
                ))}
            </div>
        </div>
    )
}

// Type guard to ensure tab component props are correct
type TabComponentProps = {
    user: User;
}

// Export type for use in tab components
export type {TabComponentProps}