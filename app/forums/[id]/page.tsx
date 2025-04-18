import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { ForumActions } from "@/components/forums/actions";
import { ForumButton } from "@/components/forums/buttons";
import { CommentForm } from "@/components/comments/form";
import { CommentList } from "@/components/comments/lists";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ForumPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  try {
    const forum = await prisma.forum.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!forum) {
      return notFound();
    }

    let userLiked = false;
    if (session?.user?.id) {
      const like = await prisma.like.findUnique({
        where: {
          userId_forumId: {
            userId: session.user.id,
            forumId: forum.id,
          },
        },
      });
      userLiked = !!like;
    }

    const isOwner = session?.user?.id === forum.userId;

    return (
      <div className="container py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to forums
          </Link>
        </Button>

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={forum.user.image || ""} alt={forum.user.name || ""} />
              <AvatarFallback>{forum.user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{forum.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(forum.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          {isOwner && <ForumActions forumId={forum.id} />}
        </div>

        <h1 className="text-3xl font-bold mb-4">{forum.title}</h1>

        {forum.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {forum.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-line mb-8">{forum.description}</p>
        </div>

        <div className="flex items-center gap-4 my-6">

          {session ? (
            <ForumButton
              forumId={forum.id}
              isForumLiked={userLiked}
              counts={forum._count}
            />
          ) : (
            <div className="flex items-center gap-1">
              <ForumButton
                isForumLiked={false}
                forumId={forum.id}
                counts={forum._count}
              />
            </div>
          )}
        </div>

        <hr className="my-6" />

        {session ? (
          <CommentForm forumId={forum.id} />
        ) : (
          <div className="text-center py-6">
            <p className="mb-2">Please sign in to join the discussion</p>
            <Button asChild>
              <Link href={`/auth?callbackUrl=/forums/${forum.id}`}>
                Sign in
              </Link>
            </Button>
          </div>
        )}

        <CommentList
          comments={forum.comments}
          currentUserId={session?.user?.id}
        />
      </div>
    );
  } catch (error) {
    console.error("Error getting forum:", error);
    return notFound();
  }
}