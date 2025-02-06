// app/admin/galleries/components/GalleryImages.tsx
"use client"

import {useState, useCallback, useEffect} from "react"
import {type Image as PrismaImage} from "@prisma/client"
import {DragDropContext, Draggable, DropResult, Droppable} from "@hello-pangea/dnd"
import {useDropzone} from "react-dropzone"
import {ImagePlus, X, Pencil} from "lucide-react"
import {toast} from "sonner"
import Image from "next/image"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Progress} from "@/components/ui/progress"

import {uploadImages, deleteImage, updateImageOrder, updateImageAlt} from "../actions"

interface GalleryImagesProps {
    galleryId: string
    images: PrismaImage[]
}

type UploadingFile = {
    id: string
    file: File
    preview: string
    progress: number
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
}

export function GalleryImages({galleryId, images: initialImages}: GalleryImagesProps) {
    const [images, setImages] = useState<PrismaImage[]>(initialImages)
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    const [deleteImageId, setDeleteImageId] = useState<string | null>(null)
    const [editingImage, setEditingImage] = useState<PrismaImage | null>(null)
    const [newAltText, setNewAltText] = useState("")
    const [isDragging, setIsDragging] = useState(false)

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            uploadingFiles.forEach(file => {
                URL.revokeObjectURL(file.preview)
            })
        }
    }, [uploadingFiles])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Filter out files that are too large
        const validFiles = acceptedFiles.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`${file.name} is too large. Maximum size is 10MB`)
                return false
            }
            return true
        })

        if (validFiles.length === 0) return

        const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
            progress: 0
        }))

        setUploadingFiles(prev => [...prev, ...newUploadingFiles])

        for (const uploadingFile of newUploadingFiles) {
            try {
                const fileData = new Uint8Array(await uploadingFile.file.arrayBuffer())

                setUploadingFiles(prev =>
                    prev.map(f =>
                        f.id === uploadingFile.id
                            ? {...f, progress: 10}
                            : f
                    )
                )

                const result = await uploadImages(galleryId, [{
                    name: uploadingFile.file.name,
                    type: uploadingFile.file.type,
                    data: fileData
                }])

                if (result.error) {
                    throw new Error(result.error)
                }

                // Update progress and local state with new images
                setUploadingFiles(prev =>
                    prev.map(f =>
                        f.id === uploadingFile.id
                            ? {...f, progress: 100}
                            : f
                    )
                )

                // Add the new images to the state immediately
                if (result.images) {
                    setImages(prevImages => [...prevImages, ...result.images])
                }

                // Remove file from uploading state after a delay
                setTimeout(() => {
                    setUploadingFiles(prev =>
                        prev.filter(f => f.id !== uploadingFile.id)
                    )
                    URL.revokeObjectURL(uploadingFile.preview)
                }, 1000)

                toast.success(`${uploadingFile.file.name} uploaded successfully`)
            } catch (error) {
                toast.error(`Failed to upload ${uploadingFile.file.name}. ` + error)
                setUploadingFiles(prev =>
                    prev.filter(f => f.id !== uploadingFile.id)
                )
                URL.revokeObjectURL(uploadingFile.preview)
            }
        }
    }, [galleryId])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: ALLOWED_FILE_TYPES,
        disabled: uploadingFiles.length > 0,
        maxSize: MAX_FILE_SIZE
    })

    const handleDelete = async () => {
        if (!deleteImageId) return

        try {
            const result = await deleteImage(deleteImageId)
            if (result.error) {
                toast.error(result.error)
            } else {
                setImages(images.filter(img => img.id !== deleteImageId))
                toast.success(result.success)
            }
        } catch {
            toast.error("Failed to delete image")
        } finally {
            setDeleteImageId(null)
        }
    }

    const handleUpdateAlt = async () => {
        if (!editingImage) return

        try {
            const result = await updateImageAlt(editingImage.id, newAltText)
            if (result.error) {
                toast.error(result.error)
            } else {
                setImages(images.map(img =>
                    img.id === editingImage.id
                        ? {...img, alt: newAltText}
                        : img
                ))
                toast.success(result.success)
            }
        } catch {
            toast.error("Failed to update alt text")
        } finally {
            setEditingImage(null)
        }
    }

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(images)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setImages(items)
        setIsDragging(false)

        try {
            const updates = items.map((item, index) => ({
                id: item.id,
                order: index
            }))

            const result2 = await updateImageOrder(galleryId, updates)
            if (result2.error) {
                toast.error(result2.error)
                setImages(initialImages)
            } else {
                toast.success("Order updated successfully")
            }
        } catch {
            toast.error("Failed to update order")
            setImages(initialImages)
        }
    }

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg transition-all duration-200",
                    isDragActive
                        ? "border-primary bg-primary/5 p-10"
                        : "border-muted-foreground/25 p-8",
                    uploadingFiles.length > 0
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:border-primary/50 hover:bg-muted/50"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className={cn(
                        "p-4 rounded-full bg-muted/50 transition-colors",
                        isDragActive && "bg-primary/10"
                    )}>
                        <ImagePlus className={cn(
                            "h-6 w-6",
                            isDragActive ? "text-primary" : "text-muted-foreground"
                        )}/>
                    </div>
                    {uploadingFiles.length > 0 ? (
                        <p className="text-sm font-medium">Uploading images...</p>
                    ) : isDragActive ? (
                        <p className="text-sm font-medium text-primary">Drop the images here...</p>
                    ) : (
                        <>
                            <p className="text-sm font-medium">Drag & drop images here, or click to select files</p>
                            <p className="text-xs text-muted-foreground">
                                Maximum size: 10MB. Supported formats: PNG, JPG, JPEG, WEBP
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Upload Progress */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-3">
                    {uploadingFiles.map((file) => (
                        <div key={file.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded overflow-hidden">
                                    <Image
                                        src={file.preview}
                                        alt={file.file.name}
                                        className="h-full w-full object-cover"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">{file.file.name}</p>
                                    <Progress value={file.progress} className="h-2"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Images Grid */}
            <DragDropContext
                onDragEnd={handleDragEnd}
                onDragStart={() => setIsDragging(true)}
            >
                <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={cn(
                                "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
                                isDragging && "ring-2 ring-primary/20 rounded-lg p-4"
                            )}
                        >
                            {images.map((image, index) => (
                                <Draggable
                                    key={image.id}
                                    draggableId={image.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={cn(
                                                "overflow-hidden group cursor-move transition-all duration-200",
                                                snapshot.isDragging && "ring-2 ring-primary shadow-lg scale-105"
                                            )}
                                        >
                                            <CardContent className="p-0 aspect-square relative">
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt || "Gallery image"}
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                    <div className="absolute top-2 right-2 flex gap-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setEditingImage(image)
                                                                setNewAltText(image.alt || '')
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4"/>
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setDeleteImageId(image.id)
                                                            }}
                                                        >
                                                            <X className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                    {image.alt && (
                                                        <div className="absolute bottom-2 left-2 right-2 truncate">
                                                            <p className="text-xs text-white/90">{image.alt}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Delete Dialog */}
            <AlertDialog open={!!deleteImageId} onOpenChange={() => setDeleteImageId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Alt Text Edit Dialog */}
            <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
                <DialogContent className="max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Image Alt Text</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="altText">Alt Text</Label>
                            <Input
                                id="altText"
                                value={newAltText}
                                onChange={(e) => setNewAltText(e.target.value)}
                                placeholder="Describe this image..."
                            />
                        </div>
                        {editingImage && (
                            <Card>
                                <CardContent className="p-2">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                        <Image
                                            src={editingImage.url}
                                            alt={editingImage.alt || "Preview"}
                                            className="object-cover"
                                            fill
                                            sizes="(max-width: 425px) 100vw"
                                            priority
                                        />
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        <p>Last updated: {new Date(editingImage.updatedAt).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            timeZoneName: 'short'
                                        })}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingImage(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateAlt}
                            disabled={editingImage?.alt === newAltText}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}