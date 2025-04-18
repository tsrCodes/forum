import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_forumId: {
          userId: session.user.id,
          forumId: params.id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { message: "You have already liked this forum" },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        forumId: params.id,
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error("Error creating like:", error);
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

    const like = await prisma.like.findUnique({
      where: {
        userId_forumId: {
          userId: session.user.id,
          forumId: params.id,
        },
      },
    });

    if (!like) {
      return NextResponse.json(
        { message: "Like not found" },
        { status: 404 }
      );
    }

    await prisma.like.delete({
      where: {
        userId_forumId: {
          userId: session.user.id,
          forumId: params.id,
        },
      },
    });

    return NextResponse.json(
      { message: "Like removed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting like:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}