import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {

  console.log("I am inside route")

  const { userId } = auth();

  if (!userId) {
    return new Response("Not Allowed", {
      status: 200,
    });
  }

  const url = new URL(request.url);
  const chatId = url.pathname.split("/").pop();

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
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

      orderBy: {
        updatedAt: "desc",
      },
    });

    return new Response(JSON.stringify(chat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("internal server error", {
      status: 200,
    });
  }
}
