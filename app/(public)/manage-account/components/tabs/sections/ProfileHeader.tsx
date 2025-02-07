// app/manage-account/components/tabs/sections/ProfileHeader.tsx
import { User2, AtSign, Calendar, Camera, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@prisma/client"

interface ProfileHeaderProps {
    user: User;
    isImageUploading: boolean;
    onImageCropperOpen: () => void;
}

export function ProfileHeader({ user, isImageUploading, onImageCropperOpen }: ProfileHeaderProps) {
    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative">
                    <Avatar className="h-20 w-20 ring-2 ring-white dark:ring-gray-800">
                        <AvatarImage
                            src={user.image ?? ''}
                            alt={`${user.name}'s avatar`}
                        />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                            <User2 className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        type="button"
                        size="icon"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full text-black dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={onImageCropperOpen}
                        disabled={isImageUploading}
                        aria-label="Update profile picture"
                    >
                        {isImageUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Camera className="h-4 w-4 " />

                        )}
                    </Button>
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {user.name}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                            <AtSign className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                            {user.username}
                        </div>
                        {user.createdAt && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                <time dateTime={user.createdAt.toISOString()}>
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </time>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}