import { Comment, User } from "@prisma/client";
import { CommentCard } from "./card";

type CommentWithUser = Comment & {
  user: User;
};

interface CommentListProps {
  comments: CommentWithUser[];
  currentUserId?: string;
}

export function CommentList({ comments, currentUserId }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-medium">Comments ({comments.length})</h3>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} currentUserId={currentUserId} />
      ))}
    </div>
  );
}