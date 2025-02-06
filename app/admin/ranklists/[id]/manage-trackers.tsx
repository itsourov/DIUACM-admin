'use client'

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useState, useTransition, useMemo, useCallback, useEffect} from "react"
import {TrackerWithRelations} from "./types"
import {attachTracker, detachTracker, getAvailableTrackers} from "./actions"
import {useToast} from "@/hooks/use-toast"
import {format} from "date-fns"

const ITEMS_PER_PAGE = 10

export function ManageTrackers({
                                   ranklistId,
                                   initialTrackers,
                               }: {
    ranklistId: string
    initialTrackers: TrackerWithRelations[]
}) {
    const [trackers, setTrackers] = useState(initialTrackers)
    const [isPending, startTransition] = useTransition()
    const {toast} = useToast()
    const [search, setSearch] = useState("")
    const [attachedSearch, setAttachedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [attachedPage, setAttachedPage] = useState(1)
    const [availableTrackers, setAvailableTrackers] = useState<TrackerWithRelations[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredTrackers = useMemo(() => {
        const searchLower = attachedSearch.toLowerCase()
        return trackers.filter(tracker =>
            tracker.title.toLowerCase().includes(searchLower) ||
            tracker.description?.toLowerCase().includes(searchLower)
        )
    }, [trackers, attachedSearch])

    const totalAttachedPages = Math.ceil(filteredTrackers.length / ITEMS_PER_PAGE)
    const paginatedTrackers = filteredTrackers.slice(
        (attachedPage - 1) * ITEMS_PER_PAGE,
        attachedPage * ITEMS_PER_PAGE
    )

    const loadAvailableTrackers = useCallback(() => {
        startTransition(async () => {
            const result = await getAvailableTrackers(ranklistId, search, page)
            if (result.success) {
                setAvailableTrackers(result.trackers)
                setTotalPages(result.pages)
                if (result.pages > 0 && page > result.pages) {
                    setPage(result.pages)
                }
            } else {
                toast({
                    title: "Error loading trackers",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }, [ranklistId, search, page, toast])

    useEffect(() => {
        if (isAddDialogOpen) {
            loadAvailableTrackers()
        }
    }, [isAddDialogOpen, loadAvailableTrackers])

    const handleAttach = (trackerId: string) => {
        startTransition(async () => {
            const result = await attachTracker(ranklistId, trackerId)
            if (result.success) {
                toast({title: "Tracker attached successfully"})
                const newTracker = availableTrackers.find(t => t.id === trackerId)
                if (newTracker) {
                    setTrackers(prev => [...prev, newTracker])
                }
                loadAvailableTrackers()
            } else {
                toast({
                    title: "Failed to attach tracker",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleDetach = (trackerId: string) => {
        startTransition(async () => {
            const result = await detachTracker(ranklistId, trackerId)
            if (result.success) {
                toast({title: "Tracker detached successfully"})
                setTrackers(prev => prev.filter(t => t.id !== trackerId))
            } else {
                toast({
                    title: "Failed to detach tracker",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
        loadAvailableTrackers()
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
                        Add Trackers
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Available Trackers</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Search available trackers..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableTrackers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">
                                            {isPending ? "Loading..." : "No trackers found"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    availableTrackers.map((tracker) => (
                                        <TableRow key={tracker.id}>
                                            <TableCell>{tracker.title}</TableCell>
                                            <TableCell>{tracker.description || '-'}</TableCell>
                                            <TableCell>
                                                {format(new Date(tracker.createdAt), 'PPP')}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAttach(tracker.id)}
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

            {/* Attached trackers section */}
            <div className="rounded-md border">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Search attached trackers..."
                                value={attachedSearch}
                                onChange={handleAttachedSearchChange}
                                className="max-w-sm"
                            />
                            <p className="text-sm text-muted-foreground">
                                {filteredTrackers.length} trackers found
                            </p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTrackers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4">
                                        {attachedSearch ? "No trackers match your search" : "No trackers attached"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedTrackers.map((tracker) => (
                                    <TableRow key={tracker.id}>
                                        <TableCell>{tracker.title}</TableCell>
                                        <TableCell>{tracker.description || '-'}</TableCell>
                                        <TableCell>
                                            {format(new Date(tracker.createdAt), 'PPP')}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDetach(tracker.id)}
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

                    {filteredTrackers.length > ITEMS_PER_PAGE && (
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