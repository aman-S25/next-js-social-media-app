
import prisma from "@/lib/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const postId = url.pathname.split("/").pop();


  if (typeof postId !== "string") {
    return new Response("Invalid PostId", {
      status: 200,
    });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response("internal server error", {
      status: 200
    });

  }
}
