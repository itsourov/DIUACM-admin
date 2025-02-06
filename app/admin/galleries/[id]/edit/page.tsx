import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { GalleryForm } from "../../components/GalleryForm";
import { GalleryImages } from "../../components/GalleryImages";
import { getGalleryAction, updateGalleryAction } from "../../actions";
import { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';

interface EditGalleryPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditGalleryPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const gallery = await getGalleryAction(resolvedParams.id);
    if (!gallery) return { title: 'Gallery Not Found' };

    return {
        title: `Edit Gallery - ${gallery.title}`,
        description: `Edit gallery: ${gallery.title}`,
    };
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
    const resolvedParams = await params;
    const gallery = await getGalleryAction(resolvedParams.id);

    if (!gallery) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle>Edit Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                    <GalleryForm
                        initialData={gallery}
                        action={updateGalleryAction}
                        isEditing={true}
                        galleryId={resolvedParams.id}
                    />
                </CardContent>
            </Card>

            <Separator />

            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle>Gallery Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <GalleryImages
                        galleryId={resolvedParams.id}
                        images={gallery.images}
                    />
                </CardContent>
            </Card>
        </div>
    );
}