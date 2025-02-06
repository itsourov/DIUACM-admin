'use client'

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateRanklistAction as updateRanklist } from "../actions"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    keyword: z.string().min(3, "Keyword must be at least 3 characters")
        .regex(/^[a-zA-Z0-9-]+$/, "Keyword can only contain letters, numbers, and hyphens"),
})

type RanklistFormValues = z.infer<typeof formSchema>

export function EditRanklistDetails({
                                        ranklistId,
                                        initialData,
                                    }: {
    ranklistId: string
    initialData: {
        title: string
        keyword: string
    }
}) {
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const form = useForm<RanklistFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    function onSubmit(data: RanklistFormValues) {
        startTransition(async () => {
            const result = await updateRanklist(ranklistId, data)
            if (result.success) {
                toast({
                    title: "Ranklist updated",
                    description: "Your changes have been saved successfully.",
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Something went wrong.",
                    variant: "destructive",
                })
            }
        })
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the display name of your ranklist.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keyword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keyword</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        A unique identifier for the ranklist. Used in URLs and API calls.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}