import { Metadata } from 'next';
import { getUsersAction } from './actions';
import { UsersList } from './components/UsersList';

export const metadata: Metadata = {
    title: 'Users Management',
    description: 'Manage users in the system',
};

interface UsersPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
    }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    // Await the searchParams before using them
    const resolvedParams = await searchParams;

    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;
    const search = resolvedParams.search || '';

    const { data: users, totalPages, currentPage } = await getUsersAction({
        page,
        search,
    });

    return (
        <div className="container mx-auto py-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Users Management</h2>
                    <p className="text-muted-foreground">
                        Create and manage users in the system
                    </p>
                </div>

                <UsersList
                    users={users}
                    totalPages={totalPages}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}