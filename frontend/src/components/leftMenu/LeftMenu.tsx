
import Link from "next/link";
import ProfileCard from "./ProfileCard";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

const LeftMenu = async ({ type }: { type: "home" | "profile" }) => {
  const { userId } = auth();
  if (!userId) return null;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex flex-col gap-6">
        <div className={type == "profile" ? `hidden` : `block`}>
          <ProfileCard />
        </div>
        <div className="flex flex-col justify-between gap-16 lg:p-6 2xl:p-12 bg-white rounded-lg shadow-md text-sm text-gray-500">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/home.png"
              alt="Homepage"
              width={16}
              height={16}
              className="w-6 h-6"
            />
            <span className="hidden text-xl xl:block">Homepage</span>
          </Link>

          <Link href="/search" className="flex items-center gap-2">
            <img
              src="/search.png"
              alt="search"
              width={16}
              height={16}
              className="w-6 h-6"
            />
            <span className="hidden text-xl xl:block">Search</span>
          </Link>

          <Link href="/notifications" className="flex items-center gap-2">
            <img
              src="/notifications.png"
              alt="notification"
              width={16}
              height={16}
              className="w-6 h-6"
            />
            <span className="hidden text-xl xl:block">Notifications</span>
          </Link>

          <Link href="/messages" className="flex items-center gap-2">
            <img
              src="/messages.png"
              alt="messages"
              width={16}
              height={16}
              className="w-6 h-6"
            />
            <span className="hidden text-xl xl:block">Messages</span>
          </Link>

          <Link href="/bookmark" className="flex items-center gap-2">
            <img
              src="/bookBlue.png"
              alt="messages"
              width={16}
              height={16}
              className="w-6 h-6"
            />
            <span className="hidden text-xl xl:block">Bookmarks</span>
          </Link>

          <Link
            href={`/profile/${user?.username}`}
            className="flex items-center gap-2"
          >
            <img
              src="/noAvatar.png"
              alt="Avatar"
              width={16}
              height={16}
              className="w-6 h-6"
            />
            <span className="hidden text-xl xl:block">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LeftMenu;






