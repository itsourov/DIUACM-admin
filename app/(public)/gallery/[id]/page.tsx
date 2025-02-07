import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import GalleryHeader from './GalleryHeader';
import ImageGrid from './ImageGrid';
import ShareButton from './ShareButton';

interface GalleryPageProps {
    params: Promise<{ id: string }>;
}

async function getGallery(id: string) {
    const gallery = await prisma.gallery.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { order: 'asc' },
            },
            _count: {
                select: { images: true }
            }
        }
    });
    if (!gallery) notFound();
    return gallery;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
    // Await the params before using them
    const resolvedParams = await params;
    const gallery = await getGallery(resolvedParams.id);

    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            <GalleryHeader
                title={gallery.title}
                description={gallery.description}
                imageCount={gallery._count.images}
                createdAt={gallery.createdAt}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <ShareButton />
                    </div>
                </div>

                <ImageGrid images={gallery.images} />
            </div>
        </main>
    );
}