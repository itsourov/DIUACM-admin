// lib/s3.ts
import {S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand} from "@aws-sdk/client-s3"
import {randomUUID} from "crypto"

// Define allowed mime types and their extensions
export const ALLOWED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif'],
} as const

export type AllowedMimeType = keyof typeof ALLOWED_FILE_TYPES

interface S3Config {
    region: string
    endpoint: string
    bucket: string
    baseUrl: string
    credentials: {
        accessKeyId: string
        secretAccessKey: string
    }
}

interface UploadOptions {
    folder?: string
    maxSizeMB?: number
    generateUniqueFilename?: boolean
    allowedFileTypes?: AllowedMimeType[]
    metadata?: Record<string, string>
}

interface UploadResult {
    url: string
    key: string
    metadata?: {
        uploadedBy: string
        uploadedAt: string
    }
}

class S3Service {
    private client: S3Client
    private config: S3Config

    constructor() {
        const requiredEnvVars = [
            'DO_SPACES_REGION',
            'DO_SPACES_ENDPOINT',
            'DO_SPACES_KEY',
            'DO_SPACES_SECRET',
            'DO_SPACES_BUCKET',
            'DO_SPACES_URL'
        ]

        // Check for required environment variables
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`Missing required environment variable: ${envVar}`)
            }
        }

        this.config = {
            region: process.env.DO_SPACES_REGION!,
            endpoint: process.env.DO_SPACES_ENDPOINT!,
            bucket: process.env.DO_SPACES_BUCKET!,
            baseUrl: process.env.DO_SPACES_URL!,
            credentials: {
                accessKeyId: process.env.DO_SPACES_KEY!,
                secretAccessKey: process.env.DO_SPACES_SECRET!,
            },
        }

        this.client = new S3Client({
            region: this.config.region,
            endpoint: this.config.endpoint,
            credentials: this.config.credentials,
        })
    }

    private validateFile(
        file: Buffer,
        mimetype: string,
        options: Required<UploadOptions>
    ): void {
        // Check file size
        const fileSizeInMB = file.length / (1024 * 1024)
        if (fileSizeInMB > options.maxSizeMB) {
            throw new Error(`File size exceeds ${options.maxSizeMB}MB limit`)
        }

        // Check mime type
        if (options.allowedFileTypes.length > 0 && !options.allowedFileTypes.includes(mimetype as AllowedMimeType)) {
            throw new Error(`Invalid file type: ${mimetype}. Allowed types: ${options.allowedFileTypes.join(', ')}`)
        }
    }

    private cleanFilename(filename: string): string {
        return filename
            .toLowerCase()
            .replace(/[^a-z0-9.]/g, '-')
    }

    async uploadFile(
        file: Buffer,
        filename: string,
        mimetype: string,
        options: UploadOptions = {}
    ): Promise<UploadResult> {
        const defaultOptions: Required<UploadOptions> = {
            folder: 'uploads',
            maxSizeMB: 10,
            generateUniqueFilename: true,
            allowedFileTypes: Object.keys(ALLOWED_FILE_TYPES) as AllowedMimeType[],
            metadata: {
                uploadedBy: 'itsourov',
                uploadedAt: new Date().toISOString(),
            },
        }

        const finalOptions = {...defaultOptions, ...options}

        try {
            // Validate file
            this.validateFile(file, mimetype, finalOptions)

            // Generate key
            const cleanFilename = this.cleanFilename(filename)
            const key = finalOptions.generateUniqueFilename
                ? `${finalOptions.folder}/${randomUUID()}-${cleanFilename}`
                : `${finalOptions.folder}/${cleanFilename}`

            // Upload file
            await this.client.send(
                new PutObjectCommand({
                    Bucket: this.config.bucket,
                    Key: key,
                    Body: file,
                    ContentType: mimetype,
                    ACL: "public-read",
                    ContentDisposition: "inline",
                    CacheControl: "public, max-age=31536000",
                    Metadata: {
                        ...finalOptions.metadata,
                        filename: cleanFilename,
                    },
                })
            )

            const url = `${this.config.baseUrl}/${key}`
            return {
                url,
                key,
                metadata: {
                    uploadedBy: finalOptions.metadata.uploadedBy,
                    uploadedAt: finalOptions.metadata.uploadedAt,
                },
            }
        } catch (error) {
            console.error("S3 Upload Error:", error)
            throw new Error(
                error instanceof Error
                    ? `Failed to upload file: ${error.message}`
                    : "Failed to upload file to storage"
            )
        }
    }

    async deleteFile(key: string): Promise<void> {
        try {
            // Check if file exists
            try {
                await this.client.send(
                    new HeadObjectCommand({
                        Bucket: this.config.bucket,
                        Key: key,
                    })
                )
            } catch (error) {
                console.warn(`File ${key} does not exist in bucket. ` + error)
                return
            }

            // Delete file
            await this.client.send(
                new DeleteObjectCommand({
                    Bucket: this.config.bucket,
                    Key: key,
                })
            )
        } catch (error) {
            console.error("S3 Delete Error:", error)
            throw new Error(
                error instanceof Error
                    ? `Failed to delete file: ${error.message}`
                    : "Failed to delete file from storage"
            )
        }
    }

    async deleteFiles(keys: string[]): Promise<void> {
        await Promise.all(keys.map(key => this.deleteFile(key)))
    }

    /**
     * Check if a file exists in the bucket
     */
    async fileExists(key: string): Promise<boolean> {
        try {
            await this.client.send(
                new HeadObjectCommand({
                    Bucket: this.config.bucket,
                    Key: key,
                })
            )
            return true
        } catch {
            return false
        }
    }

    /**
     * Get the full URL for a key
     */
    getFileUrl(key: string): string {
        return `${this.config.baseUrl}/${key}`
    }
}

// Export singleton instance
export const s3Service = new S3Service()