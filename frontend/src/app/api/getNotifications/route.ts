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
    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }, );

    return new Response(JSON.stringify(notifications), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("internal server error", {
      status: 200,
    });
  }
}
