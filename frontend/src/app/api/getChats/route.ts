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
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: true,
        user2: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy:{
        "updatedAt": "desc",
      }
    });

    return new Response(JSON.stringify(chats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response("internal server error", {
      status: 200,
    });

  }
}
