import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { PlusCircle } from "lucide-react";
import { ForumList } from "@/components/forums/lists";
import { ForumPagination } from "@/components/forums/pagination";
import { SearchForum } from "@/components/forums/search";

export default async function HomePage({ searchParams }) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 6;
  const skip = (currentPage - 1) * pageSize;

  const totalForums = await prisma.forum.count();
  const totalPages = Math.ceil(totalForums / pageSize);

  const forums = await prisma.forum.findMany({
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

    skip,
    take: pageSize,
  });


  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold mb-2">Forums</h1>
        <div className="flex items-center gap-4">
          <SearchForum />
          <Button asChild>
            <Link href="/forums/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Forum
            </Link>
          </Button>
        </div>
      </div>

      <ForumList forums={forums} />

      <ForumPagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}