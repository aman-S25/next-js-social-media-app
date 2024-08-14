



import React from "react";
import Link from "next/link";
import {useAuth} from "@clerk/nextjs"

interface SearchedUsersProps {
  Username: string;
  userId: string;
  Avatar: string;
  onChatSelect: any;
  setSearchOpen: any;
  setSearchText: any;
}

const SearchedUsersContainer: React.FC<SearchedUsersProps> = ({
  Username,
  userId,
  Avatar,
  onChatSelect,
  setSearchOpen,
  setSearchText,
}) => {


  const {userId: myUserId, isLoaded} = useAuth();

  const handleClick = () => {
    if(myUserId != userId){
      const func = async () => {
        try {
          const temp = await fetch(`/api/createChat/${userId}/`);

          if (!temp.ok) {
            throw new Error("Failed to create chat");
          }

          const newChat = await temp.json();

          console.log(newChat);

          setSearchOpen(false);
          setSearchText("");
          onChatSelect(newChat.id);

          console.log("Chat created:", newChat);
        } catch (error) {
          console.error("Error creating chat:", error);
        }
      };

      func();
    }

  };

  return (
    <div className="flex gap-6">
      <img
        src={Avatar || "/noAvatar"}
        alt=""
        className="h-6 w-6 rounded-full ring-2-black cursor-pointer"
        onClick={handleClick}
      />

      <span
        className="text-lg text-gray-600 cursor-pointer"
        onClick={handleClick}
      >
        {Username}
      </span>
    </div>
  );
};

export default SearchedUsersContainer;




