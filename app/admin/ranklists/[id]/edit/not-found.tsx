import Link from "next/link"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="container py-6">
            <Alert variant="destructive" className="mb-6">
                <AlertTitle>Ranklist not found</AlertTitle>
                <AlertDescription>
                    The ranklist you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
                </AlertDescription>
            </Alert>
            <Button asChild>
                <Link href="/admin/ranklists">Back to Ranklists</Link>
            </Button>
        </div>
    )
}