// app/admin/layout.tsx

import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import type { Metadata } from "next";
import React from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen relative">
            {/* Sidebar for both mobile and desktop */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col lg:pl-64">
                <Header />
                <main className="flex-1">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>

    )
}
export const metadata: Metadata = {
    title: "DIU ACM Admin",
    description: "Control panel for DIU ACM",
};