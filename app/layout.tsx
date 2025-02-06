import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ThemeProvider} from '@/providers/ThemeProvider';
import Navbar from '@/components/Navbar';
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Toaster2} from 'sonner';
import {SessionProvider} from "next-auth/react";


const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'DIU ACM',
    description: 'A platform for competitive programmers',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                <Navbar/>
                <main className="pt-16">
                    {children}
                </main>
                <Toaster/>
                <Toaster2 richColors/>
            </SessionProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}