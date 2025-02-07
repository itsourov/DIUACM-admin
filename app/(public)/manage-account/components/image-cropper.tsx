"use client"

import React, {useRef, useState} from "react"
import AvatarEditor from "react-avatar-editor"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Slider} from "@/components/ui/slider"
import {cn} from "@/lib/utils"

interface ImageCropperProps {
    onComplete: (croppedImage: string) => Promise<void>;
    onCancel: () => void;
}

export function ImageCropper({onComplete, onCancel}: ImageCropperProps) {
    const [image, setImage] = useState<File | string | null>(null)
    const [scale, setScale] = useState<number>(1)
    // Fix: Use AvatarEditor type directly from the import
    const editorRef = useRef<AvatarEditor>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
            setImage(file)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleSave = async (): Promise<void> => {
        if (editorRef.current && !isProcessing) {
            try {
                setIsProcessing(true)
                const canvas = editorRef.current.getImage()
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
                await onComplete(dataUrl)
            } catch (error) {
                console.error('Error saving image:', error)
            } finally {
                setIsProcessing(false)
            }
        }
    }

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {!image ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={cn(
                                "flex flex-col items-center justify-center gap-4 p-8",
                                "border-2 border-dashed rounded-lg transition-colors",
                                "hover:border-gray-400 dark:hover:border-gray-500",
                                isDragging
                                    ? "border-primary bg-muted/50"
                                    : "border-gray-200 dark:border-gray-700",
                                "cursor-pointer"
                            )}
                            role="button"
                            tabIndex={0}
                            aria-label="Drag and drop area for image upload"
                        >
                            <p className="text-sm text-muted-foreground text-center">
                                Drag and drop your image here, or click to select
                            </p>
                            <Button asChild variant="secondary">
                                <label className="cursor-pointer">
                                    Choose Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        aria-label="Choose image file"
                                    />
                                </label>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <AvatarEditor
                                    ref={editorRef}
                                    image={image}
                                    width={250}
                                    height={250}
                                    border={25}
                                    borderRadius={125}
                                    color={[0, 0, 0, 0.6]} // RGBA
                                    scale={scale}
                                    rotate={0}
                                    className="rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="scale-slider"
                                >
                                    Zoom
                                </label>
                                <Slider
                                    id="scale-slider"
                                    value={[scale]}
                                    min={1}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(value) => setScale(value[0])}
                                    aria-label="Image zoom level"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setImage(null)
                                        setScale(1)
                                    }}
                                    disabled={isProcessing}
                                    type="button"
                                >
                                    Change Image
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={isProcessing}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isProcessing}
                                    type="button"
                                >
                                    {isProcessing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}