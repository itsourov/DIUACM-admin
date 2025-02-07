// app/gallery/GalleryCard.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon, Calendar } from 'lucide-react';

type GalleryCardProps = {
    gallery: {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        images: { url: string; alt: string | null }[];
        _count: { images: number };
    };
    index: number;
};

export default function GalleryCard({ gallery, index }: GalleryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <Link href={`/gallery/${gallery.id}`}>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        {gallery.images[0] ? (
                            <Image
                                src={gallery.images[0].url}
                                alt={gallery.images[0].alt || gallery.title}
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {gallery.title}
                        </h3>
                        {gallery.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {gallery.description}
                            </p>
                        )}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(gallery.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <ImageIcon className="w-4 h-4 mr-1" />
                                {gallery._count.images} photos
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}