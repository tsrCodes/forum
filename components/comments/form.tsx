"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";

const formSchema = z.object({
    content: z.string().min(3, {
        message: "Comment must be at least 3 characters.",
    }),
});

interface CommentFormProps {
    forumId: string;
}

export function CommentForm({ forumId }: CommentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/forums/${forumId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to add comment");
            }

            form.reset();
            toast.success("Comment Added Successfully !!")

            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error("Failed to add an Comment")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Add a comment</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Share your thoughts..."
                                        className="min-h-24 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end mt-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}