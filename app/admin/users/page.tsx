// app/admin/users/page.tsx

import { Metadata } from 'next';
import { getUsersAction } from './actions';
import { UsersList } from './components/UsersList';

export const metadata: Metadata = {
    title: 'Users Management',
    description: 'Manage users in the system',
};

interface UsersPageProps {
    searchParams: {
        page?: string;
        search?: string;
    };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const search = searchParams.search || '';

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