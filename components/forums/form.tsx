"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { Forum } from "@prisma/client";
import { forumSchema, ForumSchemaType } from "@/lib/validators/forum";


interface ForumFormProps {
    forum?: Forum;
    isEditing?: boolean;
}

export function ForumForm({ forum, isEditing = false }: ForumFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const router = useRouter();

    const form = useForm<ForumSchemaType>({
        resolver: zodResolver(forumSchema),
        defaultValues: {
            title: forum?.title || "",
            description: forum?.description || "",
            tags: forum?.tags || [],
        },
    });

    async function onSubmit(values: ForumSchemaType) {
        setIsLoading(true);

        try {
            const endpoint = isEditing
                ? `/api/forums/${forum!.id}`
                : "/api/forums";

            const response = await fetch(endpoint, {
                method: isEditing ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Something went wrong");
            }

            const data = await response.json();

            toast.success(isEditing
                ? "Updated successfully."
                : "Created successfully.")

            router.push(`/forums/${data.id}`);
            router.refresh();
        } catch (err) {
            console.log(err)
            toast.error(isEditing ? "Failed to update forum" : "Failed to create forum")
        } finally {
            setIsLoading(false);
        }
    }

    const addTag = () => {
        const tag = tagInput.trim();
        if (!tag) return;

        const currentTags = form.getValues().tags || [];

        if (currentTags.includes(tag)) {
            toast.success("Tag already exists");
            return;
        }

        form.setValue("tags", [...currentTags, tag]);
        setTagInput("");
    };

    const removeTag = (tagToRemove: string) => {
        const currentTags = form.getValues().tags || [];
        form.setValue(
            "tags",
            currentTags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter a descriptive title for your forum"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Provide details about your forum topic..."
                                    className="min-h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add tags..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={addTag}
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                                        {tag}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 p-0"
                                            onClick={() => removeTag(tag)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(isEditing ? `/forums/${forum!.id}` : "/")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            isEditing ? "Updating..." : "Creating..."
                        ) : (
                            isEditing ? "Update Forum" : "Create Forum"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}