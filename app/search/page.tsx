import { ForumList } from "@/components/forums/lists";
import { ForumPagination } from "@/components/forums/pagination";
import { SearchForum } from "@/components/forums/search";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";



export const metadata: Metadata = {
    title: "Search Forums | Forum",
    description: "Search for forums by title, description, or tags",
};

export default async function SearchPage({ searchParams }) {
    const query = searchParams.q || "";
    const currentPage = Number(searchParams.page) || 1;
    const pageSize = 6;
    const skip = (currentPage - 1) * pageSize;

    const totalForums = await prisma.forum.count({
        where: query ? {
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { tags: { has: query } },
            ],
        } : {},
    });

    const totalPages = Math.ceil(totalForums / pageSize);

    const forums = await prisma.forum.findMany({
        where: query ? {
            OR: [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                { tags: { has: query } },
            ],
        } : {},
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
            <h1 className="text-3xl font-bold mb-2">Search Forums</h1>
            <p className="text-muted-foreground mb-6">
                Search for forums by title, description, or tags
            </p>

            <div className="mb-8">
                <SearchForum />
            </div>

            {query && (
                <h2 className="text-xl font-semibold mb-6">
                    {totalForums} {totalForums === 1 ? "result" : "results"} for &quot;{query}&quot;
                </h2>
            )}

            <ForumList forums={forums} />

            <ForumPagination totalPages={totalPages} currentPage={currentPage} />
        </div>
    );
}