import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ForumForm } from "@/components/forums/form";

export const metadata: Metadata = {
  title: "Edit forum | Forum",
  description: "Edit your forum post",
};

type PageProps = {
  params: {
    id: string | any;
  };
};


export default async function EditForumPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/auth');
  }

  const forum = await prisma.forum.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!forum) {
    return notFound();
  }

  if (forum.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit forum</h1>
      <div className="max-w-3xl">
        <ForumForm forum={forum} isEditing />
      </div>
    </div>
  );
}