'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useTheme} from 'next-themes';
import {usePathname, useRouter} from 'next/navigation';
import {
    Menu,
    X,
    Sun,
    Moon,
    Home,
    Calendar,
    BookOpen,
    Image as Gallery,
    Terminal,
    LogOut,
    User as UserIcon,
    Settings,
} from 'lucide-react';
import {useSession, signOut} from 'next-auth/react';
import Image from 'next/image';
import {toast} from "sonner";

interface NavLink {
    name: string;
    href: string;
    icon: React.ElementType;
}

interface UserNavItem {
    name: string;
    href?: string;
    onClick?: () => Promise<void>;
    icon: React.ElementType;
}

const navLinks: NavLink[] = [
    {name: 'Home', href: '/', icon: Home},
    {name: 'Events', href: '/events', icon: Calendar},
    {name: 'Trackers', href: '/trackers', icon: Calendar},
    {name: 'Blog', href: '/blog', icon: BookOpen},
    {name: 'Gallery', href: '/gallery', icon: Gallery},
];


export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const {theme, setTheme} = useTheme();
    const {data: session, status} = useSession();
    const pathname = usePathname();

    useEffect(() => setMounted(true), []);

    // Handle click outside for mobile menu and user menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuButton = document.getElementById('menu-button');
            const userMenu = document.getElementById('user-menu');
            const userButton = document.getElementById('user-button');

            if (mobileMenu && menuButton &&
                !mobileMenu.contains(event.target as Node) &&
                !menuButton.contains(event.target as Node)) {
                setIsOpen(false);
            }

            if (userMenu && userButton &&
                !userMenu.contains(event.target as Node) &&
                !userButton.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path: string): boolean => pathname === path;

    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({redirect: false});
        router.refresh();
        toast.success('Signed out successfully');
    };

    const userNavItems: UserNavItem[] = [
        {name: 'Profile', href: '/', icon: UserIcon},
        {name: 'Manage Account', href: '/manage-account', icon: Settings},
        {
            name: 'Sign out',
            icon: LogOut,
            onClick: handleSignOut

        },
    ];

    return (
        <nav
            className="fixed w-full z-50 top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
                    >
                        <Terminal className="h-6 w-6 text-blue-600 dark:text-blue-500"/>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-500">
                            DIUACM
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`
                                        flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                                        transition-colors duration-150 ease-in-out
                                        ${active
                                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }
                                    `}
                                >
                                    <Icon className="h-4 w-4"/>
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {mounted && (theme === 'dark'
                                    ? <Sun className="h-5 w-5"/>
                                    : <Moon className="h-5 w-5"/>
                            )}
                        </button>

                        {status === 'loading' ? (
                            <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse"/>
                        ) : !session ? (
                            <Link
                                href="/login"
                                className="
                                    bg-blue-600 hover:bg-blue-700
                                    text-white px-4 py-2 rounded-md
                                    transition-colors duration-150
                                    text-sm font-medium
                                "
                            >
                                Sign In
                            </Link>
                        ) : (
                            <div className="relative">
                                <button
                                    id="user-button"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || 'Profile'}
                                            width={28}
                                            height={28}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div
                                            className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                            {'I'}
                                        </div>
                                    )}

                                </button>

                                {showUserMenu && (
                                    <div
                                        id="user-menu"
                                        className="
                                            absolute right-0 mt-2 w-48 py-1
                                            bg-white dark:bg-gray-900
                                            rounded-md shadow-lg
                                            border border-gray-200 dark:border-gray-700
                                            z-50
                                        "
                                    >
                                        {userNavItems.map((item) => (
                                            item.href ? (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="
                                                        flex items-center space-x-2 px-4 py-2
                                                        text-sm text-gray-700 dark:text-gray-300
                                                        hover:bg-gray-100 dark:hover:bg-gray-800
                                                        transition-colors duration-150
                                                    "
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <item.icon className="h-4 w-4"/>
                                                    <span>{item.name}</span>
                                                </Link>
                                            ) : (
                                                <button
                                                    key={item.name}
                                                    onClick={item.onClick}
                                                    className="
                                                        flex items-center space-x-2 w-full px-4 py-2
                                                        text-sm text-red-600 dark:text-red-400
                                                        hover:bg-red-50 dark:hover:bg-red-900/20
                                                        transition-colors duration-150
                                                    "
                                                >
                                                    <item.icon className="h-4 w-4"/>
                                                    <span>{item.name}</span>
                                                </button>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        id="menu-button"
                        onClick={() => setIsOpen(true)}
                        className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6"/>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div
                        id="mobile-menu"
                        className="
                            fixed top-0 right-0 w-[280px] h-full
                            bg-white dark:bg-gray-900
                            z-50 transform transition-transform duration-200 ease-in-out
                            md:hidden overflow-y-auto
                        "
                    >
                        <div
                            className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X className="h-5 w-5"/>
                            </button>
                        </div>

                        {session && (
                            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex items-center space-x-3">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || 'Profile'}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div
                                            className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                            {'I'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        {session.user?.name && (
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {session.user.name}
                                            </p>
                                        )}
                                        {session.user?.email && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {session.user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="px-2 py-3">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                            flex items-center space-x-2 px-3 py-2 rounded-md mb-1
                                            ${active
                                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }
                                        `}
                                    >
                                        <Icon className="h-5 w-5"/>
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}

                            {session && (
                                <>
                                    {userNavItems.map((item) => (
                                        item.href ? (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="
                                                    flex items-center space-x-2 px-3 py-2 rounded-md mb-1
                                                    text-gray-700 dark:text-gray-300
                                                    hover:bg-gray-100 dark:hover:bg-gray-800
                                                "
                                            >
                                                <item.icon className="h-5 w-5"/>
                                                <span>{item.name}</span>
                                            </Link>
                                        ) : (
                                            <button
                                                key={item.name}
                                                onClick={() => {
                                                    item.onClick?.();
                                                    setIsOpen(false);
                                                }}
                                                className="
                                                    flex items-center space-x-2 w-full px-3 py-2 rounded-md mb-1
                                                    text-red-600 dark:text-red-400
                                                    hover:bg-red-50 dark:hover:bg-red-900/20
                                                "
                                            >
                                                <item.icon className="h-5 w-5"/>
                                                <span>{item.name}</span>
                                            </button>
                                        )
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    aria-label="Toggle theme"
                                >
                                    {mounted && (theme === 'dark'
                                            ? <Sun className="h-5 w-5"/>
                                            : <Moon className="h-5 w-5"/>
                                    )}
                                </button>
                            </div>

                            {!session && (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="
                                        mt-4 w-full bg-blue-600 hover:bg-blue-700
                                        text-white px-4 py-2 rounded-md
                                        transition-colors duration-150
                                        flex items-center justify-center
                                        text-sm font-medium
                                    "
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}