import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
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

    const comment = await prisma.comment.findUnique({
      where: {
        id: params.commentId,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { message: "UnAuthorized" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: params.commentId,
      },
    });

    return NextResponse.json(
      { message: "Comment Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}