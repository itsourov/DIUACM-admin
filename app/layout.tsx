import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Toaster2 } from 'sonner';
import React from "react";


const inter = Inter({ subsets: ['latin'] });

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

            <main>
                {children}
            </main>
            <Toaster />
            <Toaster2 richColors />

        </ThemeProvider>
        </body>
        </html>
    );
}