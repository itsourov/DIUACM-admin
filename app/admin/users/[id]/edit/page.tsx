import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { UserForm } from "@/app/admin/users/components/UserForm";
import { getUserAction, updateUserAction } from "@/app/admin/users/actions";
import { Metadata } from 'next';

interface EditUserPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditUserPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const user = await getUserAction(resolvedParams.id);
    if (!user) return { title: 'User Not Found' };

    return {
        title: `Edit User - ${user.name}`,
        description: `Edit user details for ${user.name}`,
    };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
    const resolvedParams = await params;
    const user = await getUserAction(resolvedParams.id);

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle>Edit User</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserForm
                        initialData={user}
                        action={updateUserAction}
                        isEditing={true}
                        userId={resolvedParams.id}
                    />
                </CardContent>
            </Card>
        </div>
    );
}