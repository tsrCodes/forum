import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { forumSchema } from "@/lib/validators/forum";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "UnAuthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, tags } = forumSchema.parse(body);

    const forum = await prisma.forum.create({
      data: {
        title,
        description,
        tags: tags || [],
        userId: session.user.id,
      },
    });

    return NextResponse.json(forum, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating forum:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}