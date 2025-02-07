// app/gallery/[id]/ShareButton.tsx
'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton() {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            // You might want to add a toast notification here
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <Share2 className="w-4 h-4" />
            Share Gallery
        </button>
    );
}