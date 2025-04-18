import { Forum, User } from "@prisma/client";
import { ForumCard } from "./card";

type ForumWithUserAndCounts = Forum & {
  user?: User;
  _count: {
    comments: number;
    likes: number;
  };
};

interface ForumListProps {
  forums: ForumWithUserAndCounts[];
}

export function ForumList({ forums }: ForumListProps) {
  if (forums.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No forums found</h3>
        <p className="text-muted-foreground mt-1">
          Be the first to create a forum!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {forums.map((forum) => (
        <ForumCard key={forum.id} forum={forum} />
      ))}
    </div>
  );
}