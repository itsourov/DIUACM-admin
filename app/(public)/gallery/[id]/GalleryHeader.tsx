// app/gallery/[id]/GalleryHeader.tsx
import { Calendar, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    title: string;
    description: string | null;
    imageCount: number;
    createdAt: Date;
};

export default function GalleryHeader({ title, description, imageCount, createdAt }: Props) {
    return (
        <div className="bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-4">
                    <Link
                        href="/gallery"
                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        ← Back to galleries
                    </Link>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                </h1>

                {description && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-3xl">
                        {description}
                    </p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={createdAt.toISOString()}>
                            {createdAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {imageCount} photos
                    </div>
                </div>
            </div>
        </div>
    );
}