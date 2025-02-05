// app/admin/users/new/page.tsx

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserForm } from "@/app/admin/users/components/UserForm";
import { createUserAction } from "@/app/admin/users/actions";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New User',
    description: 'Create a new user in the system',
};

export default function NewUserPage() {
    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserForm
                        action={createUserAction}
                        isEditing={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}