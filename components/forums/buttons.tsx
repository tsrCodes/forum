"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ForumButtonProps {
    forumId: string;
    counts: {
        comments: number;
        likes: number;
    },
    isForumLiked: boolean;
}

export function ForumButton({ forumId, isForumLiked, counts }: ForumButtonProps) {
    const [isLiked, setIsLiked] = useState(isForumLiked);
    const [likeCount, setLikeCount] = useState(counts.likes);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const toggleLike = async () => {
        setIsLoading(true);

        try {
            const method = isLiked ? "DELETE" : "POST";
            const response = await fetch(`/api/forums/${forumId}/like`, {
                method,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to update like status");
            }

            setIsLiked(!isLiked);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
            toast.success(!isLiked ? 'Liked' : 'DisLiked')
            router.refresh();
        } catch (err) {
            console.log(err)

            toast.error("Failed")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 cursor-pointer"
                            >

                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                <span>{counts.comments}</span>
                            </Button></TooltipTrigger>
                        <TooltipContent>
                            <p>Total Comments</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 cursor-pointer"
                            onClick={toggleLike}
                            disabled={isLoading}
                        >
                            <Heart
                                className={cn(
                                    "h-5 w-5",
                                    isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"
                                )}
                            />
                            <span>{likeCount}</span>
                        </Button></TooltipTrigger>
                    <TooltipContent>
                        <p>{!isLiked ? 'Add Like' : 'Remove Like'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>

    );
}