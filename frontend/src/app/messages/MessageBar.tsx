





"use client";
import "./page.css";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { createMessage } from "@/lib/actions";
import { useSocket } from "@/context/SocketContext";

interface messageProps {
  Messages: any;
  otherUserName: string;
  chatId: string;
  otherUserId: string;
  avatar: string;
}

const MessageBar: React.FC<messageProps> = ({
  Messages,
  otherUserName,
  otherUserId,
  chatId,
  avatar,
}) => {
  const socket = useSocket();
  const { userId } = useAuth();
  const [textArea, setTextArea] = useState<string>("");
  const [messages, setMessages] = useState<any[]>(Messages);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(Messages);
  }, [Messages]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (data) => {
        if (data.chatId === chatId) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();

    if (!textArea.trim().length) return;

    const newMessage = {
      senderId: userId,
      receiverUserId: otherUserId,
      content: textArea,
      createdAt: new Date(),
      chatId: chatId,
    };

    try {
      await createMessage(textArea, userId || "", chatId);
      socket?.emit("send_message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTextArea("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col message-container lg:h-[600px]">
      <div className="flex-1 p-4 overflow-y-scroll bg-gray-100">
        <div className="flex flex-col gap-3">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white p-4 flex items-center gap-3">
        <img
          src={avatar || './noAvatar.png'}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <form className="flex-1 flex" onSubmit={handleSendMessage}>
          <textarea
            value={textArea}
            onChange={(e) => setTextArea(e.target.value)}
            placeholder={`Message ${otherUserName}`}
            className="flex-1 border rounded-lg p-2 resize-none"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBar;
