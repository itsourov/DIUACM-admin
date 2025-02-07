// app/gallery/page.tsx
import {prisma} from '@/lib/prisma';
import GalleryCard from './GalleryCard';

async function getGalleries() {

    return prisma.gallery.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            images: {
                take: 1
            },
            _count: {
                select: {images: true}
            }
        }
    });
}

export default async function GalleryPage() {
    const galleries = await getGalleries();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Photo Gallery
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Explore our collection of memorable moments and events
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleries.map((gallery, index) => (
                            <GalleryCard key={gallery.id} gallery={gallery} index={index}/>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
