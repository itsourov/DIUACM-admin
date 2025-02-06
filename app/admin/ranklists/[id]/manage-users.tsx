// app/admin/ranklists/[id]/manage-users.tsx
'use client'

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useState, useTransition, useMemo, useCallback, useEffect} from "react"
import {UserWithRelations} from "./types"
import {attachUser, detachUser, getAvailableUsers, updateUserScore} from "../actions/manage-users"
import {useToast} from "@/hooks/use-toast"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Label} from "@/components/ui/label"

const ITEMS_PER_PAGE = 10

export function ManageUsers({
                                ranklistId,
                                initialUsers,
                            }: {
    ranklistId: string
    initialUsers: UserWithRelations[]
}) {
    const [users, setUsers] = useState(initialUsers)
    const [isPending, startTransition] = useTransition()
    const {toast} = useToast()
    const [search, setSearch] = useState("")
    const [attachedSearch, setAttachedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [attachedPage, setAttachedPage] = useState(1)
    const [availableUsers, setAvailableUsers] = useState<UserWithRelations[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [selectedUser, setSelectedUser] = useState<UserWithRelations | null>(null)
    const [editScore, setEditScore] = useState<number>(0)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredUsers = useMemo(() => {
        const searchLower = attachedSearch.toLowerCase()
        return users.filter(user =>
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower)
        )
    }, [users, attachedSearch])

    const totalAttachedPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const paginatedUsers = filteredUsers.slice(
        (attachedPage - 1) * ITEMS_PER_PAGE,
        attachedPage * ITEMS_PER_PAGE
    )

    const loadAvailableUsers = useCallback(() => {
        startTransition(async () => {
            const result = await getAvailableUsers(ranklistId, search, page)
            if (result.success) {
                setAvailableUsers(result.users)
                setTotalPages(result.pages)
                // Update page if current page is beyond total pages
                if (result.pages > 0 && page > result.pages) {
                    setPage(result.pages)
                }
            } else {
                toast({
                    title: "Error loading users",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }, [ranklistId, search, page, toast])

    // Load available users when dialog opens
    useEffect(() => {
        if (isAddDialogOpen) {
            loadAvailableUsers()
        }
    }, [isAddDialogOpen, loadAvailableUsers])

    const handleAttach = (userId: string) => {
        startTransition(async () => {
            const result = await attachUser(ranklistId, userId, 0)
            if (result.success) {
                toast({title: "User attached successfully"})
                const newUser = availableUsers.find(u => u.id === userId)
                if (newUser) {
                    setUsers(prev => [...prev, {...newUser, score: 0}])
                }
                loadAvailableUsers()
            } else {
                toast({
                    title: "Failed to attach user",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleDetach = (userId: string) => {
        startTransition(async () => {
            const result = await detachUser(ranklistId, userId)
            if (result.success) {
                toast({title: "User detached successfully"})
                setUsers(prev => prev.filter(u => u.id !== userId))
            } else {
                toast({
                    title: "Failed to detach user",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleScoreChange = (value: string) => {
        if (value === '') {
            setEditScore(0)
            return
        }

        const numValue = parseFloat(value)
        if (!isNaN(numValue) && numValue >= 0) {
            setEditScore(numValue)
        }
    }

    const handleScoreUpdate = () => {
        if (!selectedUser) return
        if (editScore < 0) return

        startTransition(async () => {
            const result = await updateUserScore(ranklistId, selectedUser.id, editScore)
            if (result.success) {
                toast({title: "Score updated successfully"})
                setUsers(prev => prev.map(u =>
                    u.id === selectedUser.id ? {...u, score: editScore} : u
                ))
                setSelectedUser(null)
            } else {
                toast({
                    title: "Failed to update score",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
        loadAvailableUsers()
    }

    const handleAttachedSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAttachedSearch(e.target.value)
        setAttachedPage(1)
    }

    return (
        <div className="space-y-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-4">
                        Add Users
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Available Users</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Search available users..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">
                                            {isPending ? "Loading..." : "No users found"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    availableUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.image || ''}/>
                                                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAttach(user.id)}
                                                    disabled={isPending}
                                                >
                                                    Attach
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="flex justify-between items-center">
                            <Button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1 || isPending}
                            >
                                Previous
                            </Button>
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page >= totalPages || isPending}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Score Edit Modal */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update User Score</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedUser?.image || ''}/>
                                    <AvatarFallback>{selectedUser?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{selectedUser?.name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedUser?.username}</p>
                                </div>
                            </div>
                            <Label>Score</Label>
                            <Input
                                type="number"
                                value={editScore}
                                onChange={(e) => handleScoreChange(e.target.value)}
                                step="0.01"
                                min="0"
                                placeholder="Enter score (e.g., 45.75)"
                            />
                            <p className="text-sm text-muted-foreground">
                                Score must be a non-negative number
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedUser(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleScoreUpdate}
                            disabled={isPending || editScore < 0}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Attached users section */}
            <div className="rounded-md border">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Search attached users..."
                                value={attachedSearch}
                                onChange={handleAttachedSearchChange}
                                className="max-w-sm"
                            />
                            <p className="text-sm text-muted-foreground">
                                {filteredUsers.length} users found
                            </p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4">
                                        {attachedSearch ? "No users match your search" : "No users attached"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.image || ''}/>
                                                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setEditScore(user.score || 0)
                                                }}
                                            >
                                                {user.score?.toFixed(2) || '0.00'}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDetach(user.id)}
                                                disabled={isPending}
                                            >
                                                Detach
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {filteredUsers.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-between items-center mt-4">
                            <Button
                                onClick={() => setAttachedPage(prev => Math.max(1, prev - 1))}
                                disabled={attachedPage === 1}
                            >
                                Previous
                            </Button>
                            <span>
                                Page {attachedPage} of {totalAttachedPages}
                            </span>
                            <Button
                                onClick={() => setAttachedPage(prev => Math.min(totalAttachedPages, prev + 1))}
                                disabled={attachedPage >= totalAttachedPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}