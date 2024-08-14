// "use client";

// import { switchBlock, switchFollow } from "@/lib/actions";
// import { useOptimistic, useState } from "react";
// import {useAuth} from "@clerk/nextjs"
// import { useSocket } from "@/context/SocketContext";
// import { createNotification } from "@/lib/actions";

// const UserInfoCardInteraction = ({
//   userId,
//   isUserBlocked,
//   isFollowing,
//   isFollowingSent,
// }: {
//   userId: string;
//   isUserBlocked: boolean;
//   isFollowing: boolean;
//   isFollowingSent: boolean;
// }) => {
//   const [userState, setUserState] = useState({
//     following: isFollowing,
//     blocked: isUserBlocked,
//     followingRequestSent: isFollowingSent,
//   });

//   console.log("following", userState.following);
//   console.log("blocked", userState.blocked);
//   console.log("followingRequestSent", userState.followingRequestSent);

//   const { userId: myUserId, isLoaded } = useAuth();
//   const socket = useSocket();

//   const follow = async () => {
//     switchOptimisticState("follow");
//     try {
//       await switchFollow(userId);
//       setUserState((prev) => ({
//         ...prev,
//         following: prev.following && false,
//         // following: false,
//         followingRequestSent:
//           !prev.following && !prev.followingRequestSent ? true : false,
//       }));
//     } catch (err) {}
//   };

//   // console.log("Inside the follow function");
//   // console.log("following", userState.following);
//   // console.log("blocked", userState.blocked);
//   // console.log("followingRequestSent", userState.followingRequestSent);

//   const handleClick = async () => {
    
//     console.log(userState.followingRequestSent);

//     if (userState.followingRequestSent == false) {
//       if (socket) {
//         const msgData = {
//           senderUserId: myUserId,
//           receiverUserId: userId,
//           title: "sent you follow request",
//           msg: "",
//           time: new Date().toISOString(),
//         };
//         socket.emit("send_notification", msgData);
//       }

//       const temp = await createNotification(
//         "sent you follow request",
//         "",
//         myUserId || "",
//         userId
//       );
//     }
//   };

//   const block = async () => {
//     switchOptimisticState("block");
//     try {
//       await switchBlock(userId);
//       setUserState((prev) => ({
//         ...prev,
//         blocked: !prev.blocked,
//       }));
//     } catch (err) {}
//   };

//   const [optimisticState, switchOptimisticState] = useOptimistic(
//     userState,
//     (state, value: "follow" | "block") =>
//       value === "follow"
//         ? {
//             ...state,
//             following: state.following && false,
//             followingRequestSent:
//               !state.following && !state.followingRequestSent ? true : false,
//           }
//         : { ...state, blocked: !state.blocked }
//   );
//   return (
//     <>
//       <form
//         action={() => {
//           follow();
//         }}
//       >
//         <button className="w-full bg-blue-500 text-white text-sm rounded-md p-2">
//           {optimisticState.following
//             ? "Following"
//             : optimisticState.followingRequestSent
//             ? "Friend Request Sent"
//             : "Follow"}
//         </button>
//       </form>
//       <form action={block} className="self-end ">
//         <button>
//           <span className="text-red-400 text-xs cursor-pointer">
//             {optimisticState.blocked ? "Unblock User" : "Block User"}
//           </span>
//         </button>
//       </form>
//     </>
//   );
// };

// export default UserInfoCardInteraction;







"use client";

import { switchBlock, switchFollow } from "@/lib/actions";
import { useOptimistic, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSocket } from "@/context/SocketContext";
import { createNotification } from "@/lib/actions";

const UserInfoCardInteraction = ({
  userId,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  });

  console.log("following", userState.following);
  console.log("blocked", userState.blocked);
  console.log("followingRequestSent", userState.followingRequestSent);

  const { userId: myUserId, isLoaded } = useAuth();
  const socket = useSocket();

  const follow = async () => {
    const shouldSendNotification =
      !userState.following && !userState.followingRequestSent;
    switchOptimisticState("follow");
    try {
      await switchFollow(userId);
      setUserState((prev) => ({
        ...prev,
        following: prev.following && false,
        followingRequestSent:
          !prev.following && !prev.followingRequestSent ? true : false,
      }));

      if (shouldSendNotification) {
        handleClick();
      }
    } catch (err) {}
  };

  const handleClick = async () => {
    console.log(userState.followingRequestSent);

    if (socket) {
      const msgData = {
        senderUserId: myUserId,
        receiverUserId: userId,
        title: "sent you follow request",
        msg: "",
        time: new Date().toISOString(),
      };
      socket.emit("send_notification", msgData);
    }

    await createNotification(
      "sent you follow request",
      "",
      myUserId || "",
      userId
    );
  };

  const block = async () => {
    switchOptimisticState("block");
    try {
      await switchBlock(userId);
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked,
      }));
    } catch (err) {}
  };

  const [optimisticState, switchOptimisticState] = useOptimistic(
    userState,
    (state, value: "follow" | "block") =>
      value === "follow"
        ? {
            ...state,
            following: state.following && false,
            followingRequestSent:
              !state.following && !state.followingRequestSent ? true : false,
          }
        : { ...state, blocked: !state.blocked }
  );

  return (
    <>
      <form action={follow}>
        <button className="w-full bg-blue-500 text-white text-sm rounded-md p-2">
          {optimisticState.following
            ? "Following"
            : optimisticState.followingRequestSent
            ? "Friend Request Sent"
            : "Follow"}
        </button>
      </form>
      <form action={block} className="self-end ">
        <button>
          <span className="text-red-400 text-xs cursor-pointer">
            {optimisticState.blocked ? "Unblock User" : "Block User"}
          </span>
        </button>
      </form>
    </>
  );
};

export default UserInfoCardInteraction;
