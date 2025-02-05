import { Metadata } from 'next';
import { getTrackersAction } from './actions';
import { TrackersList } from './components/TrackersList';

export const metadata: Metadata = {
    title: 'Trackers Management',
    description: 'Manage trackers in the system',
};

interface TrackersPageProps {
    searchParams: {
        page?: string;
        search?: string;
    };
}

export default async function TrackersPage({ searchParams }: TrackersPageProps) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const search = searchParams.search || '';

    const { data: trackers, totalPages, currentPage } = await getTrackersAction({
        page,
        search,
    });

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Trackers Management</h2>
                    <p className="text-muted-foreground">
                        Create and manage trackers in the system
                    </p>
                </div>

                <TrackersList
                    trackers={trackers}
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}