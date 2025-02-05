import React from 'react';

export default function AdminLoading() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center ">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-lg font-medium text-gray-700">Loading Admin Panel...</p>
            </div>
        </div>
    );
}