// app/admin/galleries/[id]/edit/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { GalleryForm } from "../../components/GalleryForm";
import { GalleryImages } from "../../components/GalleryImages";
import { getGalleryAction, updateGalleryAction } from "../../actions";
import { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';

interface EditGalleryPageProps {
    params: { id: string };
}

export async function generateMetadata({ params }: EditGalleryPageProps): Promise<Metadata> {
    const gallery = await getGalleryAction(params.id);
    if (!gallery) return { title: 'Gallery Not Found' };

    return {
        title: `Edit Gallery - ${gallery.title}`,
        description: `Edit gallery: ${gallery.title}`,
    };
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
    const gallery = await getGalleryAction(params.id);

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
                        galleryId={params.id}
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
                        galleryId={params.id}
                        images={gallery.images}
                    />
                </CardContent>
            </Card>
        </div>
    );
}