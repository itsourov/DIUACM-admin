import { Metadata } from 'next';
import { getRanklistsAction } from './actions';
import { RanklistsList } from './components/RanklistsList';

export const metadata: Metadata = {
    title: 'Ranklists Management',
    description: 'Manage ranklists in the system',
};

interface RanklistsPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
    }>;
}

export default async function RanklistsPage({ searchParams }: RanklistsPageProps) {
    // Await the searchParams before using them
    const resolvedParams = await searchParams;

    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;
    const search = resolvedParams.search || '';

    const { data: ranklists, totalPages, currentPage } = await getRanklistsAction({
        page,
        search,
    });

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ranklists Management</h2>
                    <p className="text-muted-foreground">
                        Create and manage ranklists in the system
                    </p>
                </div>

                <RanklistsList
                    ranklists={ranklists}
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}