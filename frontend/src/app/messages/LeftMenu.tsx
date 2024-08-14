"use client"


import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const LeftMenu = () => {

  const { userId, isLoaded } = useAuth();
  if (!userId) return null;


  const [user, setUser] = useState<any>();

  useEffect(()=>{
    const func = async()=>{
      try{
        const data = await fetch(`api/getUser/${userId}`);
        if (!data.ok) {
          throw new Error("Network response was not ok");
        }
        const temp = await data.json();
        setUser(temp);
      }
      catch(err){
        console.log(err);
      }
    }

    if(isLoaded){
      func();
    }
    
  }, [userId, isLoaded]);  

  return (
    <>
      <div className="hidden lg:flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-16 lg:p-4 2xl:p-8 bg-white rounded-lg shadow-md text-sm text-gray-500">
          <Link href="/" className="flex items-center gap-2 w-max">
            <img
              src="/home.png"
              alt="Homepage"
              width={16}
              height={16}
              className="w-6 h-6"
            />
          </Link>

          <Link href="/search" className="flex items-center gap-2 w-max">
            <img
              src="/search.png"
              alt="search"
              width={16}
              height={16}
              className="w-6 h-6"
            />
          </Link>

          <Link href="/notifications" className="flex items-center gap-2 w-max">
            <img
              src="/notifications.png"
              alt="notification"
              width={16}
              height={16}
              className="w-6 h-6"
            />
          </Link>

          <Link href="/messages" className="flex items-center gap-2 w-max">
            <img
              src="/messages.png"
              alt="messages"
              width={16}
              height={16}
              className="w-6 h-6"
            />
          </Link>

          <Link href="/bookmark" className="flex items-center gap-2 w-max">
            <img
              src="/bookBlue.png"
              alt="messages"
              width={16}
              height={16}
              className="w-6 h-6"
            />
          </Link>

          <Link
            href={`/profile/${user?.username}`}
            className="flex items-center gap-2 w-max"
          >
            <img
              src="/noAvatar.png"
              alt="Avatar"
              width={16}
              height={16}
              className="w-6 h-6"
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default LeftMenu;




