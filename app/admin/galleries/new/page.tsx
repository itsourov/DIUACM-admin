// app/admin/galleries/new/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GalleryForm } from "../components/GalleryForm";
import { createGalleryAction } from "../actions";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Gallery',
    description: 'Create a new image gallery',
};

export default function NewGalleryPage() {
    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                    <GalleryForm
                        action={createGalleryAction}
                        isEditing={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}