import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Post from "@/components/feed/Post";

const Bookmarks = async() => {
  const { userId } = auth();
  let posts: any[] = [];

    if(userId){
        posts = await prisma.bookmark.findMany({
          where: {
            userId,
          },
          include:{
            post: {
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
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        });
    }
  

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-around p-2 bg-white p-4 rounded-lg">
          <h1 className="text-3xl text-gray-700">Bookmarked posts</h1>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            {posts.length
              ? posts.map((bookmark) => <Post key={bookmark.id} post={bookmark.post} />)
              : "No posts found!"}
          </div>
        </div>
      </div>
    );
}
export default Bookmarks;
