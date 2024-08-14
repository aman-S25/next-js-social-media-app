

"use client";

// import React from "react";
import React, { useEffect, useState } from "react";
import LeftMenu from "./LeftMenu";
import { useAuth } from "@clerk/nextjs";
import BottomMenu from "@/components/bottomMenu/BottomMenu";
import ChatBar from "./ChatBar";
import MessageBar from "./MessageBar";
import "./page.css";

const MainPage = () => {
  const { userId, isLoaded } = useAuth();

  const [allChats, setAllChats] = useState<any>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [otherUserName, setOtherUserName] = useState<string>("");
  const [otherUserAvatar, setOtherUserAvatar] = useState<string>("");
  const [otherUserId, setOtherUserId] = useState<string>("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`/api/getChats/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userChats = await response.json();

        const chats = userChats.map((chat: any) => {
          const otherUser = chat.user1Id === userId ? chat.user2 : chat.user1;
          return {
            id: chat.id,
            otherUser,
            messages: chat.messages,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            lastMessage: chat.lastMessage,
          };
        });
        setAllChats(chats);
      } catch (error) {
        console.log(error);
      }
    };

    if (isLoaded) {
      fetchChats();
    }
  }, [userId, isLoaded]);

  const handleChatSelect = async (chatId: string) => {
    let chatVar: any;
    let newChat: any;
    chatVar = allChats.find((X: any) => X.id === chatId);

    if (!chatVar) {
      const fetchChat = async (chatId: string) => {
        try {
          const response = await fetch(`/api/getChat/${chatId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const userChat = await response.json();
          const otherUser =
            userChat.user1Id === userId ? userChat.user2 : userChat.user1;
          const chat = {
            id: userChat.id,
            otherUser,
            messages: userChat.messages,
            createdAt: userChat.createdAt,
            updatedAt: userChat.updatedAt,
            lastMessage: userChat.lastMessage,
          };
          return chat;
        } catch (error) {
          console.log(error);
          return null;
        }
      };

      if (isLoaded) {
        newChat = await fetchChat(chatId);
        if (!newChat) {
          return;
        }
      }
    } else {
      newChat = chatVar;
    }

    setSelectedChat(chatId);
    setMessages(newChat.messages);
    const temp =
      newChat.otherUser.name.length && newChat.otherUser.surname.length
        ? newChat.otherUser.name + " " + newChat.otherUser.surname
        : newChat.otherUser.username;
    setOtherUserName(temp);
    setOtherUserAvatar(newChat.otherUser.avatar);
    setOtherUserId(newChat.otherUser.id);

    if (!chatVar) {
      setAllChats((preChats: any) => [newChat, ...preChats]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 pt-6 pb-12 w-full">
      <div className="hidden lg:block w-1/4">
        <LeftMenu />
      </div>
      <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-6">
        <div
          className={`lg:h-[600px] flex-1 lg:w-1/3 bg-white rounded-xl shadow-lg overflow-y-auto`}
        >
          <ChatBar
            chats={allChats}
            onChatSelect={handleChatSelect}
            selectedChatId={selectedChat}
          />
        </div>
        <div className="lg:h-[600px] flex-1 lg:w-2/3 bg-white rounded-xl shadow-lg overflow-y-scroll">
          <MessageBar
            Messages={messages}
            otherUserName={otherUserName}
            otherUserId={otherUserId || ""}
            chatId={selectedChat || ""}
            avatar={otherUserAvatar}
          />
        </div>
      </div>
      <BottomMenu />
    </div>
  );
};

export default MainPage;
