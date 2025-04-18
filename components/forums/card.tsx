import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Heart } from "lucide-react";
import { Forum, User } from "@prisma/client";

type ForumWithUserAndCounts = Forum & {
  user?: User;
  _count: {
    comments: number;
    likes: number;
  };
};

interface ForumCardProps {
  forum: ForumWithUserAndCounts;
}

export function ForumCard({ forum }: ForumCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-1 text-left">
            <Link href={`/forums/${forum.id}`} className="hover:underline">
              {forum.title}
            </Link>
          </CardTitle>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>by {forum?.user?.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(forum.createdAt), { addSuffix: true })}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground line-clamp-3">
          {forum.description}
        </p>
        {forum.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {forum.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-end pt-2 text-muted-foreground">
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">{forum._count.comments}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 fill-destructive text-destructive" />

          <span className="text-sm">{forum._count.likes}</span>
        </div>
      </CardFooter>
    </Card>
  );
}