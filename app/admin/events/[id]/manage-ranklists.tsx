'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useTransition, useMemo, useCallback, useEffect } from "react"
import { RanklistWithRelations } from "./types"
import { attachRanklist, detachRanklist, getAvailableRanklists, updateRanklistWeight } from "../actions/manage-ranklists"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

const ITEMS_PER_PAGE = 10

export function ManageRanklists({
                                    eventId,
                                    initialRanklists,
                                }: {
    eventId: string
    initialRanklists: RanklistWithRelations[]
}) {
    const [ranklists, setRanklists] = useState(initialRanklists)
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()
    const [search, setSearch] = useState("")
    const [attachedSearch, setAttachedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [attachedPage, setAttachedPage] = useState(1)
    const [availableRanklists, setAvailableRanklists] = useState<RanklistWithRelations[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [selectedRanklist, setSelectedRanklist] = useState<RanklistWithRelations | null>(null)
    const [editWeight, setEditWeight] = useState<number>(0)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredRanklists = useMemo(() => {
        const searchLower = attachedSearch.toLowerCase()
        return ranklists.filter(ranklist =>
            ranklist.title.toLowerCase().includes(searchLower) ||
            ranklist.keyword.toLowerCase().includes(searchLower)
        )
    }, [ranklists, attachedSearch])

    const totalAttachedPages = Math.ceil(filteredRanklists.length / ITEMS_PER_PAGE)
    const paginatedRanklists = filteredRanklists.slice(
        (attachedPage - 1) * ITEMS_PER_PAGE,
        attachedPage * ITEMS_PER_PAGE
    )

    const loadAvailableRanklists = useCallback(() => {
        startTransition(async () => {
            const result = await getAvailableRanklists(eventId, search, page)
            if (result.success) {
                setAvailableRanklists(result.ranklists)
                setTotalPages(result.pages)
                if (result.pages > 0 && page > result.pages) {
                    setPage(result.pages)
                }
            } else {
                toast({
                    title: "Error loading ranklists",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }, [eventId, search, page, toast])

    useEffect(() => {
        if (isAddDialogOpen) {
            loadAvailableRanklists()
        }
    }, [isAddDialogOpen, loadAvailableRanklists])

    const handleAttach = (ranklistId: string) => {
        startTransition(async () => {
            const result = await attachRanklist(eventId, ranklistId, 1.0)
            if (result.success) {
                toast({ title: "Ranklist attached successfully" })
                const newRanklist = availableRanklists.find(r => r.id === ranklistId)
                if (newRanklist) {
                    setRanklists(prev => [...prev, { ...newRanklist, weight: 1.0 }])
                }
                loadAvailableRanklists()
            } else {
                toast({
                    title: "Failed to attach ranklist",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleDetach = (ranklistId: string) => {
        startTransition(async () => {
            const result = await detachRanklist(eventId, ranklistId)
            if (result.success) {
                toast({ title: "Ranklist detached successfully" })
                setRanklists(prev => prev.filter(r => r.id !== ranklistId))
            } else {
                toast({
                    title: "Failed to detach ranklist",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleWeightChange = (value: string) => {
        if (value === '') {
            setEditWeight(0)
            return
        }

        const numValue = parseFloat(value)
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
            setEditWeight(numValue)
        }
    }

    const handleWeightUpdate = () => {
        if (!selectedRanklist) return
        if (editWeight < 0 || editWeight > 1) return

        startTransition(async () => {
            const result = await updateRanklistWeight(eventId, selectedRanklist.id, editWeight)
            if (result.success) {
                toast({ title: "Weight updated successfully" })
                setRanklists(prev => prev.map(r =>
                    r.id === selectedRanklist.id ? { ...r, weight: editWeight } : r
                ))
                setSelectedRanklist(null)
            } else {
                toast({
                    title: "Failed to update weight",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
        loadAvailableRanklists()
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
                        Add Ranklists
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Available Ranklists</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Search available ranklists..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Keyword</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableRanklists.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">
                                            {isPending ? "Loading..." : "No ranklists found"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    availableRanklists.map((ranklist) => (
                                        <TableRow key={ranklist.id}>
                                            <TableCell>{ranklist.title}</TableCell>
                                            <TableCell>{ranklist.keyword}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAttach(ranklist.id)}
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

            {/* Weight Edit Modal */}
            <Dialog open={!!selectedRanklist} onOpenChange={(open) => !open && setSelectedRanklist(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Ranklist Weight</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Ranklist: {selectedRanklist?.title}</Label>
                            <Input
                                type="number"
                                value={editWeight}
                                onChange={(e) => handleWeightChange(e.target.value)}
                                step="0.1"
                                min="0"
                                max="1"
                                placeholder="Enter weight (0.0 - 1.0)"
                            />
                            <p className="text-sm text-muted-foreground">
                                Weight must be between 0.0 and 1.0
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRanklist(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleWeightUpdate}
                            disabled={isPending || editWeight < 0 || editWeight > 1}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Attached ranklists section */}
            <div className="rounded-md border">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Search attached ranklists..."
                                value={attachedSearch}
                                onChange={handleAttachedSearchChange}
                                className="max-w-sm"
                            />
                            <p className="text-sm text-muted-foreground">
                                {filteredRanklists.length} ranklists found
                            </p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Keyword</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedRanklists.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4">
                                        {attachedSearch ? "No ranklists match your search" : "No ranklists attached"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedRanklists.map((ranklist) => (
                                    <TableRow key={ranklist.id}>
                                        <TableCell>{ranklist.title}</TableCell>
                                        <TableCell>{ranklist.keyword}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedRanklist(ranklist)
                                                    setEditWeight(ranklist.weight || 1.0)
                                                }}
                                            >
                                                {ranklist.weight?.toFixed(2) || '1.0'}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDetach(ranklist.id)}
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

                    {filteredRanklists.length > ITEMS_PER_PAGE && (
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