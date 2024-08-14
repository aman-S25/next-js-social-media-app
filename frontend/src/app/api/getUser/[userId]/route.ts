import prisma from "@/lib/client";

export async function GET(request: Request) {


  const url = new URL(request.url);
  const userId = url.pathname.split("/").pop();

  try {
    const user = await prisma.user.findFirst({
      where: {
        id:userId
      },
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response("internal server error", {
      status: 200,
    });

  }
}
