import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart } from "lucide-react";
import { Metadata } from "next";
import { ForumList } from "@/components/forums/lists";

export const metadata: Metadata = {
  title: "My Profile | Forum",
  description: "View and manage your profile",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect("/auth?callbackUrl=/profile");
  }

  const forums = await prisma.forum.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
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

  const comments = await prisma.comment.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      forum: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  const likedForums = await prisma.forum.findMany({
    where: {
      likes: {
        some: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
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

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={session.user.image || ""} alt={session.user.name} />
          <AvatarFallback className="text-4xl">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{session.user.name}</h1>
          <p className="text-muted-foreground mb-2">{session.user.email}</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{forums.length} forums</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{likedForums.length} likes</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="forums" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="forums">My Forums</TabsTrigger>
          <TabsTrigger value="comments">My Comments</TabsTrigger>
          <TabsTrigger value="likes">Liked Forums</TabsTrigger>
        </TabsList>

        <TabsContent value="forums">
          <h2 className="text-2xl font-semibold mb-4">My Forums</h2>
          <ForumList forums={forums} />
        </TabsContent>

        <TabsContent value="comments">
          <h2 className="text-2xl font-semibold mb-4">My Comments</h2>
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                You haven&apos;t commented on any forums yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <p className="mb-2">
                    <span className="font-medium">On forum: </span>
                    <a 
                      href={`/forums/${comment.forumId}`} 
                      className="text-primary hover:underline"
                    >
                      {comment.forum.title}
                    </a>
                  </p>
                  <p className="text-sm mb-2">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes">
          <h2 className="text-2xl font-semibold mb-4">Liked Forums</h2>
          <ForumList forums={likedForums} />
        </TabsContent>
      </Tabs>
    </div>
  );
}