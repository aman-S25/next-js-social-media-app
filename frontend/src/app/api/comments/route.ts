// /app/api/comments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { postId, desc } = await request.json();
  const { userId } = auth(); 

  if (!userId) {
    return NextResponse.json(
      { error: "User is not authenticated!" },
      { status: 401 }
    );
  }

  

  try {
    const createdComment = await prisma.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(createdComment);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
