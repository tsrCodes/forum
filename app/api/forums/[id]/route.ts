import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const forumSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  req: Request,
  { params }
) {
  try {
    const forum = await prisma.forum.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
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
      return NextResponse.json(
        { message: "Forum not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(forum);
  } catch (error) {
    console.error("Error fetching forum:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const forum = await prisma.forum.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!forum) {
      return NextResponse.json(
        { message: "Forum not found" },
        { status: 404 }
      );
    }

    if (forum.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Not authorized to update this forum" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, tags } = forumSchema.parse(body);

    const updatedForum = await prisma.forum.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        tags: tags || [],
      },
    });

    return NextResponse.json(updatedForum);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating forum:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const forum = await prisma.forum.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!forum) {
      return NextResponse.json(
        { message: "Forum not found" },
        { status: 404 }
      );
    }

    if (forum.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Not authorized to delete this forum" },
        { status: 403 }
      );
    }

    await prisma.forum.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "Forum deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting forum:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}