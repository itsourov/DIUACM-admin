// app/admin/ranklists/[id]/manage-events.tsx

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
import {EventWithRelations} from "./types"
import {attachEvent, detachEvent, getAvailableEvents, updateEventWeight} from "../actions/manage-events"
import {useToast} from "@/hooks/use-toast"
import {format} from "date-fns"
import {Label} from "@/components/ui/label"

const ITEMS_PER_PAGE = 10

export function ManageEvents({
                                 ranklistId,
                                 initialEvents,
                             }: {
    ranklistId: string
    initialEvents: EventWithRelations[]
}) {
    const [events, setEvents] = useState(initialEvents)
    const [isPending, startTransition] = useTransition()
    const {toast} = useToast()
    const [search, setSearch] = useState("")
    const [attachedSearch, setAttachedSearch] = useState("")
    const [page, setPage] = useState(1)
    const [attachedPage, setAttachedPage] = useState(1)
    const [availableEvents, setAvailableEvents] = useState<EventWithRelations[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [selectedEvent, setSelectedEvent] = useState<EventWithRelations | null>(null)
    const [editWeight, setEditWeight] = useState<number>(0)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredEvents = useMemo(() => {
        const searchLower = attachedSearch.toLowerCase()
        return events.filter(event =>
            event.title.toLowerCase().includes(searchLower) ||
            format(new Date(event.startDateTime), 'PPP HH:mm')
                .toLowerCase()
                .includes(searchLower)
        )
    }, [events, attachedSearch])

    const totalAttachedPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
    const paginatedEvents = filteredEvents.slice(
        (attachedPage - 1) * ITEMS_PER_PAGE,
        attachedPage * ITEMS_PER_PAGE
    )

    const loadAvailableEvents = useCallback(() => {
        startTransition(async () => {
            const result = await getAvailableEvents(ranklistId, search, page)
            if (result.success) {
                setAvailableEvents(result.events)
                setTotalPages(result.pages)
                // Update page if current page is beyond total pages
                if (result.pages > 0 && page > result.pages) {
                    setPage(result.pages)
                }
            } else {
                toast({
                    title: "Error loading events",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }, [ranklistId, search, page, toast])

    // Load available events when dialog opens
    useEffect(() => {
        if (isAddDialogOpen) {
            loadAvailableEvents()
        }
    }, [isAddDialogOpen, loadAvailableEvents])

    const handleAttach = (eventId: string) => {
        startTransition(async () => {
            const result = await attachEvent(ranklistId, eventId, 1.0)
            if (result.success) {
                toast({title: "Event attached successfully"})
                const newEvent = availableEvents.find(e => e.id === eventId)
                if (newEvent) {
                    setEvents(prev => [...prev, {...newEvent, weight: 1.0}])
                }
                loadAvailableEvents()
            } else {
                toast({
                    title: "Failed to attach event",
                    description: result.error,
                    variant: "destructive"
                })
            }
        })
    }

    const handleDetach = (eventId: string) => {
        startTransition(async () => {
            const result = await detachEvent(ranklistId, eventId)
            if (result.success) {
                toast({title: "Event detached successfully"})
                setEvents(prev => prev.filter(e => e.id !== eventId))
            } else {
                toast({
                    title: "Failed to detach event",
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
        if (!selectedEvent) return
        if (editWeight < 0 || editWeight > 1) return

        startTransition(async () => {
            const result = await updateEventWeight(ranklistId, selectedEvent.id, editWeight)
            if (result.success) {
                toast({title: "Weight updated successfully"})
                setEvents(prev => prev.map(e =>
                    e.id === selectedEvent.id ? {...e, weight: editWeight} : e
                ))
                setSelectedEvent(null)
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
        loadAvailableEvents()
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
                        Add Events
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Available Events</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Search available events..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Start Date & Time</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableEvents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4">
                                            {isPending ? "Loading..." : "No events found"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    availableEvents.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell>{event.title}</TableCell>
                                            <TableCell>
                                                {format(new Date(event.startDateTime), 'PPP HH:mm')}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAttach(event.id)}
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
            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Event Weight</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Event: {selectedEvent?.title}</Label>
                            <Input                                 type="number"
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
                        <Button variant="outline" onClick={() => setSelectedEvent(null)}>
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

            {/* Attached events section */}
            <div className="rounded-md border">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Search attached events..."
                                value={attachedSearch}
                                onChange={handleAttachedSearchChange}
                                className="max-w-sm"
                            />
                            <p className="text-sm text-muted-foreground">
                                {filteredEvents.length} events found
                            </p>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Start Date & Time</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedEvents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4">
                                        {attachedSearch ? "No events match your search" : "No events attached"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedEvents.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>{event.title}</TableCell>
                                        <TableCell>
                                            {format(new Date(event.startDateTime), 'PPP HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedEvent(event)
                                                    setEditWeight(event.weight || 1.0)
                                                }}
                                            >
                                                {event.weight?.toFixed(1) || '1.0'}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDetach(event.id)}
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

                    {filteredEvents.length > ITEMS_PER_PAGE && (
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