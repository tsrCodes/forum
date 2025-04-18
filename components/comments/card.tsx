import { formatDistanceToNow } from "date-fns";
import { Card, CardContent,  CardHeader } from "@/components/ui/card";
import { Comment, User } from "@prisma/client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CommentActions } from "./actions";

type CommentWithUser = Comment & {
    user: User;
};

interface CommentCardProps {
    comment: CommentWithUser
    currentUserId?: string
}

export function CommentCard({ comment, currentUserId }: CommentCardProps) {
    return (
        <Card key={comment.id}>
            <CardHeader className="flex flex-row items-start space-y-0 gap-3">
                <Avatar className="">
                    <AvatarFallback>{comment.user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{comment.user.name}</p>
                        {currentUserId === comment.userId && (
                            <CommentActions commentId={comment.id} forumId={comment.forumId} />
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm whitespace-pre-line">{comment.content}</p>
            </CardContent>
        </Card>
    );
}