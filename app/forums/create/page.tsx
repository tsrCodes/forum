import { ForumForm } from "@/components/forums/form";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create a New forum | Forum",
  description: "Create a new discussion forum",
};

export default async function CreateForumPage() {
  const session = await getServerSession();

  if (!session) {
    return redirect('/auth');
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create a new forum</h1>
      <div className="max-w-3xl">
        <ForumForm />
      </div>
    </div>
  );
}