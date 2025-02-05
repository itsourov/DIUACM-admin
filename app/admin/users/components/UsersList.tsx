// app/admin/users/components/UsersList.tsx

'use client';

import { User } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/app/admin/components/shared/DataTable/DataTable";
import { deleteUserAction } from "@/app/admin/users/actions";
import { Edit2, Trash2, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



interface UsersListProps {
    users: User[];
    totalPages: number;
    currentPage: number;
}

export function UsersList({ users, totalPages, currentPage }: UsersListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteUserAction(id);
            if (result.success) {
                toast.success('User deleted successfully');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete user');
            }
        } catch (error) {
            toast.error(`An error occurred while deleting the user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const columns = [
        {
            header: 'User',
            accessorKey: 'name' as const,
            cell: (user: User) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image || '.'} alt={user.name} />
                        <AvatarFallback>
                            <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                            {user.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Username',
            accessorKey: 'username' as const,
            cell: (user: User) => (
                <div className="font-medium">{user.username}</div>
            ),
        },
        {
            header: 'Department',
            accessorKey: 'department' as const,
            cell: (user: User) => (
                user.department ? (
                    <Badge variant="outline">
                        {user.department}
                    </Badge>
                ) : null
            ),
        },
        {
            header: 'Coding Handles',
            accessorKey: 'codeforcesHandle' as const,
            cell: (user: User) => (
                <div className="flex flex-wrap gap-2">
                    {user.codeforcesHandle && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                            CF: {user.codeforcesHandle}
                        </Badge>
                    )}
                    {user.atcoderHandle && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                            AC: {user.atcoderHandle}
                        </Badge>
                    )}
                    {user.vjudgeHandle && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                            VJ: {user.vjudgeHandle}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id' as const,
            cell: (user: User) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="icon"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <DataTable
                data={users}
                columns={columns}
                totalPages={totalPages}
                currentPage={currentPage}
                searchPlaceholder="Search users by name or email..."
                onCreate={() => router.push('/admin/users/new')}
            />
        </div>
    );
}