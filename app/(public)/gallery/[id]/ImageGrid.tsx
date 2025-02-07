// app/gallery/[id]/ImageGrid.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FullscreenViewer from './FullscreenViewer';
import { ImageIcon } from 'lucide-react';

type ImageType = {
    id: string;
    url: string;
    alt: string | null;
};

export default function ImageGrid({ images }: { images: ImageType[] }) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    return (
        <>
            <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                role="grid"
                aria-label="Gallery images"
            >
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
                        role="gridcell"
                        tabIndex={0}
                        onClick={() => setSelectedImage(index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedImage(index);
                            }
                        }}
                    >
                        <Image
                            src={image.url}
                            alt={image.alt || `Image ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <ImageIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {selectedImage !== null && (
                <FullscreenViewer
                    images={images}
                    currentIndex={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </>
    );
}