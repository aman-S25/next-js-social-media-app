// src/context/SocketContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {useAuth} from "@clerk/nextjs"

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {userId, isLoaded} = useAuth();

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    // const socketUrl = "http://localhost:3001";
    if (!socketUrl) {
      console.log("Socket URL is not defined");
      return;
    }
    const socketIo = io(socketUrl);
    setSocket(socketIo);

    // return () => {
    //   socketIo.disconnect();
    // };
  }, []);

  useEffect(() => {
    if (socket && userId) {
      socket.emit("register_user", {userId});
    }
  }, [socket, userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
