// app/manage-account/components/tabs/ProfileTab.tsx
"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { profileSchema, type ProfileFormData } from '../../validations'
import { updateProfile, updateProfileImage, type FieldErrors } from '../../actions'
import { ProfileHeader } from './sections/ProfileHeader'
import { BasicInformation } from './sections/BasicInformation'
import { CodingPlatforms } from './sections/CodingPlatforms'
import { UniversityInformation } from './sections/UniversityInformation'
import { FormActions } from './sections/FormActions'
import { ImageCropper } from '../image-cropper'
import type { User } from "@prisma/client"

interface ProfileTabProps {
    user: User;
}

export default function ProfileTab({ user }: ProfileTabProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [isImageCropperOpen, setIsImageCropperOpen] = useState<boolean>(false)
    const [isImageUploading, setIsImageUploading] = useState<boolean>(false)

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name ?? '',
            email: user.email ?? '',
            username: user.username ?? '',
            phone: user.phone ?? '',
            gender: user.gender as ProfileFormData['gender'] ?? 'unspecified',
            codeforcesHandle: user.codeforcesHandle ?? '',
            atcoderHandle: user.atcoderHandle ?? '',
            vjudgeHandle: user.vjudgeHandle ?? '',
            startingSemester: user.startingSemester ?? '',
            department: user.department ?? '',
            studentId: user.studentId ?? ''
        }
    })

    const handleCroppedImage = async (croppedImage: string): Promise<void> => {
        try {
            setIsImageUploading(true)
            const result = await updateProfileImage(croppedImage)

            if (result.success) {
                toast.success("Profile picture updated successfully!")
            } else {
                toast.error(result.error || "Failed to update profile picture")
            }
        } catch (error) {
            toast.error("An unexpected error occurred while updating profile picture")
            console.error('Profile picture update error:', error)
        } finally {
            setIsImageUploading(false)
            setIsImageCropperOpen(false)
        }
    }

    const onSubmit = async (data: ProfileFormData): Promise<void> => {
        try {
            setIsLoading(true)
            setFieldErrors({})

            const result = await updateProfile(data)

            if (result.errors) {
                setFieldErrors(result.errors)
                return
            }

            if (!result.success && result.error) {
                toast.error(result.error)
                return
            }

            if (result.success) {
                toast.success("Profile updated successfully!")
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
            console.error('Profile update error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <ProfileHeader
                user={user}
                isImageUploading={isImageUploading}
                onImageCropperOpen={() => setIsImageCropperOpen(true)}
            />

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
                <BasicInformation form={form} fieldErrors={fieldErrors} />
                <CodingPlatforms form={form} />
                <UniversityInformation form={form} />
                <FormActions user={user} isLoading={isLoading} />
            </form>

            {isImageCropperOpen && (
                <ImageCropper
                    onComplete={handleCroppedImage}
                    onCancel={() => setIsImageCropperOpen(false)}
                />
            )}
        </div>
    )
}