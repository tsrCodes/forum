import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { commentSchema } from "@/lib/validators/comment";

export async function POST(
  req: Request,
  { params }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "UnAuthorized" },
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

    const body = await req.json();
    const { content } = commentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        forumId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}