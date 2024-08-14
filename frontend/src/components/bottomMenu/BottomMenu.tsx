"use client"

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import prisma from "@/lib/client";
import { useState, useEffect } from "react";

const BottomMenu = () => {
  const { userId, isLoaded } = useAuth();
  if (!userId) return null;

  const [user, setUser] = useState<any>();

  useEffect(() => {
    const func = async () => {
      try {
        const data = await fetch(`api/getUser/${userId}`);
        if (!data.ok) {
          throw new Error("Network response was not ok");
        }
        const temp = await data.json();
        setUser(temp);
      } catch (err) {
        console.log(err);
      }
    };

    if (isLoaded) {
      func();
    }
  }, [userId, isLoaded]); 

  return (
    <>
      {/* Bottom navigation bar for smaller screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2">
        <Link href="/" className="flex flex-col items-center gap-1">
          <img
            src="/home.png"
            alt="Homepage"
            width={16}
            height={16}
            className="w-6 h-6"
          />
          <span className="text-xs text-gray-500">Home</span>
        </Link>

        <Link href="/search" className="flex flex-col items-center gap-1">
          <img
            src="/search.png"
            alt="search"
            width={16}
            height={16}
            className="w-6 h-6"
          />
          <span className="text-xs text-gray-500">Search</span>
        </Link>

        <Link
          href="/notifications"
          className="flex flex-col items-center gap-1"
        >
          <img
            src="/notifications.png"
            alt="notification"
            width={16}
            height={16}
            className="w-6 h-6"
          />
          <span className="text-xs text-gray-500">Notifications</span>
        </Link>

        <Link href="/messages" className="flex flex-col items-center gap-1">
          <img
            src="/messages.png"
            alt="messages"
            width={16}
            height={16}
            className="w-6 h-6"
          />
          <span className="text-xs text-gray-500">Messages</span>
        </Link>

        <Link href="/bookmark" className="flex flex-col items-center gap-1">
          <img
            src="/bookBlue.png"
            alt="messages"
            width={16}
            height={16}
            className="w-6 h-6"
          />
          <span className="text-xs text-gray-500">Bookmarks</span>
        </Link>

        <Link
          href={`/profile/${user?.username}`}
          className="flex flex-col items-center gap-1"
        >
          <img
            src="/noAvatar.png"
            alt="Avatar"
            width={16}
            height={16}
            className="w-6 h-6"
          />
          <span className="text-xs text-gray-500">Profile</span>
        </Link>
      </div>
    </>
  );
};

export default BottomMenu;
