

import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/client";

export async function GET(request: Request) {

  const url = new URL(request.url);
  const userId = url.pathname.split("/").pop();
  const {userId: myUserId} = auth();

    try {
      const { userId: myUserId } = auth();

      let chat;

      chat = await prisma.chat.findFirst({
        where: {
          OR: [
            { user1Id: userId || "", user2Id: myUserId || "" },
            { user2Id: userId || "", user1Id: myUserId || "" },
          ],
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
      });

      if (!chat) {
        chat = await prisma.chat.create({
          data: {
            user1Id: userId || "",
            user2Id: myUserId || "",
          },
        });
        console.log("New chat created:", chat);
      } else {
        console.log("Existing chat found:", chat);
      }

      return new Response(JSON.stringify(chat), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

      // return NextResponse.json(comments, { status: 200 });
    } catch (error) {
      return new Response("internal server error", {
        status: 200,
      });
    }

  
}