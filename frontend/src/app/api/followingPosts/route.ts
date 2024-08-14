
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {


  const { userId } = auth();


  if (!userId) {
    return new Response("Not Allowed", {
      status: 200,
    });
  }

  try {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);
    let ids = followingIds.filter((id): id is string => id !== undefined);

    ids = [...ids, userId];


    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          select: {
            userId: true,
          },
        },
        bookmarks: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response("internal server error", {
      status: 200,
    });

  }
}
