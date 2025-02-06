import { Metadata } from 'next';
import { getGalleriesAction } from './actions';
import { GalleriesList } from './components/GalleriesList';

export const metadata: Metadata = {
    title: 'Galleries Management',
    description: 'Create and manage image galleries',
};

interface GalleriesPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
    }>;
}

export default async function GalleriesPage({ searchParams }: GalleriesPageProps) {
    // Await the searchParams before using them
    const resolvedParams = await searchParams;

    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;
    const search = resolvedParams.search || '';

    const { data: galleries, totalPages, currentPage } = await getGalleriesAction({
        page,
        search,
    });

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Galleries Management</h2>
                    <p className="text-muted-foreground">
                        Create and manage image galleries in the system
                    </p>
                </div>

                <GalleriesList
                    galleries={galleries}
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}