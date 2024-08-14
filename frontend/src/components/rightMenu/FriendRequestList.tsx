"use client";

import { acceptFollowRequest, declineFollowRequest } from "@/lib/actions";
import { FollowRequest, User } from "@prisma/client";
// import Image from "next/image";
import { useOptimistic, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { createNotification } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";

type RequestWithUser = FollowRequest & {
  sender: User;
};

const FriendRequestList = ({ requests }: { requests: RequestWithUser[] }) => {
  const [requestState, setRequestState] = useState(requests);

  const { userId: myUserId, isLoaded } = useAuth();
  const socket = useSocket();

  const accept = async (requestId: string, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await acceptFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));

      if (socket) {
        const msgData = {
          senderUserId: myUserId,
          receiverUserId: userId,
          title: "accepted your follow request",
          msg: "",
          time: new Date().toISOString(),
        };
        socket.emit("send_notification", msgData);


        const msgData2 = {
          senderUserId: userId,
          receiverUserId: myUserId,
          title: "started following you",
          msg: "",
          time: new Date().toISOString(),
        };
        socket.emit("send_notification", msgData2);
      }

      await createNotification(
        "accepted your follow request",
        "",
        myUserId || "",
        userId
      );
      await createNotification(
        "started following you",
        "",
        userId,
        myUserId || "",
      );


    } catch (err) {}
  };
  const decline = async (requestId: string, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await declineFollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {}
  };

  const [optimisticRequests, removeOptimisticRequest] = useOptimistic(
    requestState,
    (state, value: string) => state.filter((req) => req.id !== value)
  );
  return (
    <div className="">
      {optimisticRequests.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4">
            <img
              src={request.sender.avatar || "/noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">
              {request.sender.name && request.sender.surname
                ? request.sender.name + " " + request.sender.surname
                : request.sender.username}
            </span>
          </div>
          <div className="flex gap-3 justify-end">
            <form action={() => accept(request.id, request.sender.id)}>
              <button>
                <img
                  src="/accept.png"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
            </form>
            <form action={() => decline(request.id, request.sender.id)}>
              <button>
                <img
                  src="/reject.png"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
