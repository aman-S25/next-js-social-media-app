// import type { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   const { username } = req.query;

//   if (typeof username !== "string") {
//     return res.status(400).json({ error: "Invalid username" });
//   }

//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         user: {
//           username: username,
//         },
//       },
//       include: {
//         user: true,
//         likes: {
//           select: {
//             userId: true,
//           },
//         },
//         comments: {
//           select: {
//             userId: true,
//           },
//         },
//         bookmarks: {
//           select: {
//             userId: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching posts" });
//   }
// }











import prisma from "@/lib/client";

export async function GET(request: Request) {

  const url = new URL(request.url);
  const username = url.pathname.split("/").pop();



  try {
    const posts = await prisma.post.findMany({
      where: {
        user: {
          username: username,
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