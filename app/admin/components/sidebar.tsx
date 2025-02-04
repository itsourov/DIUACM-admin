// components/admin/sidebar.tsx
"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    Settings,
    Package,
    BarChart,
    X
} from "lucide-react"
import {useEffect} from "react"
import {useSidebarStore} from "../lib/store"

const sidebarLinks = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Events",
        href: "/admin/events",
        icon: Package,
    },
    {
        title: "Ranklists",
        href: "/admin/ranklists",
        icon: Package,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const {isOpen, close} = useSidebarStore()

    // Close sidebar on route change
    useEffect(() => {
        close()
    }, [pathname, close])

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between p-6">
                        <Link href="/admin" className="flex items-center gap-2 font-semibold">
                            <Package className="h-6 w-6"/>
                            <span>Admin Panel</span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={close}
                        >
                            <X className="h-6 w-6"/>
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {sidebarLinks.map((link) => {
                                const Icon = link.icon
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                    >
                                        <span
                                            className={cn(
                                                "group flex items-center rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                                                pathname === link.href ? "bg-accent" : "transparent",
                                            )}
                                        >
                                            <Icon className="mr-2 h-4 w-4"/>
                                            <span>{link.title}</span>
                                        </span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}