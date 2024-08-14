import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req:any, res:any) {
  if (req.method === "POST") {
    try {
      const { content, senderId, chatId } = JSON.parse(req.body);

      const newMessage = await prisma.message.create({
        data: {
          content,
          senderId,
          chatId,
        },
      });

      res.status(200).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to post message" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
