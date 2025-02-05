// app/admin/galleries/actions.ts
"use server"

import {prisma} from "@/lib/prisma"
import {s3Service} from "@/lib/s3"
import {revalidatePath} from "next/cache"
import {z} from "zod"
import {galleryFormSchema} from "./schema"
import {getPaginationParams} from "@/lib/utils/pagination"
import {buildSearchQuery} from "@/lib/utils/search"
import {Prisma} from "@prisma/client"
import {PaginationParams} from "@/types/base"

// Gallery List Action
export async function getGalleriesAction(params: PaginationParams = {}) {
    const {skip, take, page} = getPaginationParams(params);

    const where: Prisma.GalleryWhereInput = params.search
        ? buildSearchQuery(params.search, ['title', 'description'])
        : {};

    const [galleries, total] = await Promise.all([
        prisma.gallery.findMany({
            where,
            orderBy: {createdAt: 'desc'},
            include: {
                images: {
                    orderBy: {order: 'asc'}
                },
                _count: {
                    select: {images: true}
                }
            },
            skip,
            take,
        }),
        prisma.gallery.count({where}),
    ]);

    return {
        data: galleries,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / take),
        hasMore: skip + take < total,
    };
}

// Single Gallery Action
export async function getGalleryAction(id: string) {
    return prisma.gallery.findUnique({
        where: {id},
        include: {
            images: {
                orderBy: {order: 'asc'}
            }
        }
    });
}

// Create Gallery Action
export async function createGalleryAction(_: string, values: z.infer<typeof galleryFormSchema>) {
    try {
        const validatedFields = galleryFormSchema.parse(values)

        await prisma.gallery.create({
            data: {
                title: validatedFields.title,
                description: validatedFields.description,
            },
        })

        revalidatePath("/admin/galleries")
        return {success: "Gallery created successfully"}
    } catch (error) {
        console.error('Create gallery error:', error)
        return {error: "Failed to create gallery"}
    }
}

// Update Gallery Action
export async function updateGalleryAction(id: string, values: z.infer<typeof galleryFormSchema>) {
    try {
        const validatedFields = galleryFormSchema.parse(values)

        await prisma.gallery.update({
            where: {id},
            data: {
                title: validatedFields.title,
                description: validatedFields.description,
            },
        })

        revalidatePath("/admin/galleries")
        return {success: "Gallery updated successfully"}
    } catch (error) {
        console.error('Update gallery error:', error)
        return {error: "Failed to update gallery"}
    }
}

// Delete Gallery Action
export async function deleteGalleryAction(id: string) {
    try {
        // First get all images to delete from S3
        const images = await prisma.image.findMany({
            where: {galleryId: id},
            select: {key: true}
        })

        // Delete all images from S3
        await Promise.all(
            images.map(image => s3Service.deleteFile(image.key))
        )

        // Delete gallery (will cascade delete images)
        await prisma.gallery.delete({
            where: {id},
        })

        revalidatePath("/admin/galleries")
        return {success: true}
    } catch (error) {
        console.error('Delete gallery error:', error)
        return {success: false, error: "Failed to delete gallery"}
    }
}

// Image Upload Interface
interface UploadImagePayload {
    name: string
    type: string
    data: Uint8Array
}

// Upload Images Action
export async function uploadImages(galleryId: string, files: UploadImagePayload[]) {
    try {
        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const buffer = Buffer.from(file.data)
                const {url, key} = await s3Service.uploadFile(buffer, file.name, file.type, {
                    folder: `galleries/${galleryId}`,
                    maxSizeMB: 10,
                })

                return prisma.image.create({
                    data: {
                        url,
                        key,
                        alt: '',
                        galleryId,
                        order: 0, // Will be updated later
                    },
                })
            })
        )

        // Update order for all images
        const allImages = await prisma.image.findMany({
            where: {galleryId},
            orderBy: {order: 'asc'},
        })

        await Promise.all(
            allImages.map((image, index) =>
                prisma.image.update({
                    where: {id: image.id},
                    data: {order: index},
                })
            )
        )

        revalidatePath(`/admin/galleries/${galleryId}`)
        return {images: uploadedImages}
    } catch (error) {
        console.error('Upload error:', error)
        return {error: 'Failed to upload images'}
    }
}

// Delete Image Action
export async function deleteImage(imageId: string) {
    try {
        const image = await prisma.image.findUnique({
            where: {id: imageId},
            select: {key: true, galleryId: true},
        })

        if (!image) {
            throw new Error('Image not found')
        }

        // Delete from S3
        await s3Service.deleteFile(image.key)

        // Delete from database
        await prisma.image.delete({
            where: {id: imageId},
        })

        revalidatePath(`/admin/galleries/${image.galleryId}`)
        return {success: 'Image deleted successfully'}
    } catch (error) {
        console.error('Delete error:', error)
        return {error: 'Failed to delete image'}
    }
}

// Update Image Order Action
export async function updateImageOrder(galleryId: string, updates: { id: string; order: number }[]) {
    try {
        await Promise.all(
            updates.map(update =>
                prisma.image.update({
                    where: {id: update.id},
                    data: {order: update.order},
                })
            )
        )

        revalidatePath(`/admin/galleries/${galleryId}`)
        return {success: 'Order updated successfully'}
    } catch (error) {
        console.error('Update order error:', error)
        return {error: 'Failed to update image order'}
    }
}

// Update Image Alt Text Action
export async function updateImageAlt(imageId: string, alt: string) {
    try {
        const image = await prisma.image.update({
            where: {id: imageId},
            data: {alt},
        })

        revalidatePath(`/admin/galleries/${image.galleryId}`)
        return {success: 'Alt text updated successfully'}
    } catch (error) {
        console.error('Update alt text error:', error)
        return {error: 'Failed to update alt text'}
    }
}