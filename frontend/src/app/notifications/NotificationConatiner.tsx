// // *******************Best Till now**********************

// "use client";
// import React, { useState, useEffect } from "react";
// import { useSocket } from "@/context/SocketContext";
// import { formatDistanceToNow } from "date-fns";



// const NotificationContainer = () => {
//   const socket = useSocket();
//   const [notifications, setNotifications] = useState<any[]>(
//     []
//   );

//   // Fetch notifications on mount
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const response = await fetch("/api/getNotifications/");
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       // Assuming the data is an array of notifications
//       const formattedNotifications = data.map((curr: any) => ({
//         userId: curr.sender.userId,
//         username: curr.sender.username,
//         name: curr.sender.name,
//         surname: curr.sender.surname,
//         avatar: curr.sender.avatar,
//         title: curr.title,
//         msg: curr.message,
//         time: curr.createdAt,
//       }));

//       setNotifications(formattedNotifications);
//     };

//     fetchNotifications();
//   }, []);

//   // Handle incoming socket notifications
//  useEffect(() => {
//    if (socket) {
//      socket.on("receive_notification", (data) => {
//        console.log("bol de bhai ab");
//         const func = async()=>{
//          try {
//           console.log(data.userId);
//            const response = await fetch(`/api/getUser/${data.senderUserId}`);
//            if (!response.ok) {
//              throw new Error("Network response was not ok");
//            }

//            const user = await response.json();

//            const notificationData = {
//              userId: user.id,
//              username: user.username,
//              name: user.name,
//              surname: user.surname,
//              avatar: user.avatar,
//              title: data.title,
//              msg: data.msg,
//              time: data.time,
//            };

//            console.log("M aa gya hu idhar");

//            setNotifications((prev) => [notificationData, ...prev]);
//          } catch (error) {
//            console.error("Error fetching user data:", error);
//          }
//         }

//         func();
//      });

//      return () => {
//        socket.off("receive_notification");
//      };
//    }
//  }, [socket]);


//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex items-center justify-around p-4 bg-white text-3xl rounded-lg shadow-lg">
//         <h1 className="text-gray-600">Notifications</h1>
//       </div>

//       <div className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-lg">
//         {notifications.length > 0 ? (
//           notifications.map(
//             (
//               { userId, username, name, surname, avatar, title, msg, time },
//               key
//             ) => (
//               <div key={key} className="flex gap-3">
//                 <img
//                   src={avatar || "./noAvatar.png"}
//                   className="w-8 h-8 rounded-full"
//                   alt={`${username}'s avatar`}
//                 />
//                 <div className="flex flex-col">
//                   <div className="flex items-center gap-3">
//                     <span className="text-xl text-gray-600">{
//                       (name?.length > 0 && surname?.length > 0)? name+" "+surname : username
//                     }</span>
//                     <span className="text-lg text-gray-700">{title}</span>
//                   </div>
//                   <p>{msg}</p>
//                   <small>
//                     {formatDistanceToNow(new Date(time), { addSuffix: true })}
//                   </small>
//                 </div>
//               </div>
//             )
//           )
//         ) : (
//           <div>No Notifications Found !!</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationContainer;















"use client";
import React, { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const NotificationContainer = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch("/api/getNotifications/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Assuming the data is an array of notifications
      const formattedNotifications = data.map((curr: any) => ({
        userId: curr.sender.userId,
        username: curr.sender.username,
        name: curr.sender.name,
        surname: curr.sender.surname,
        avatar: curr.sender.avatar,
        title: curr.title,
        msg: curr.message,
        time: curr.createdAt,
      }));

      setNotifications(formattedNotifications);
    };

    fetchNotifications();
  }, []);

  // Handle incoming socket notifications
  useEffect(() => {
    if (socket) {
      socket.on("receive_notification", (data) => {
        console.log("bol de bhai ab");
        const func = async () => {
          try {
            console.log(data.userId);
            const response = await fetch(`/api/getUser/${data.senderUserId}`);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const user = await response.json();

            const notificationData = {
              userId: user.id,
              username: user.username,
              name: user.name,
              surname: user.surname,
              avatar: user.avatar,
              title: data.title,
              msg: data.msg,
              time: data.time,
            };

            console.log("M aa gya hu idhar");

            setNotifications((prev) => [notificationData, ...prev]);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };

        func();
      });

      return () => {
        socket.off("receive_notification");
      };
    }
  }, [socket]);

  return (
    <>
      <div className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-lg">
        {notifications.length > 0 ? (
          notifications.map(
            (
              { userId, username, name, surname, avatar, title, msg, time },
              key
            ) => (
              <div key={key} className="flex gap-3">
                <Link href={`/profile/${username}`}>
                  <img
                    src={avatar || "./noAvatar.png"}
                    className="w-8 h-8 rounded-full"
                    alt={`${username}'s avatar`}
                  />
                </Link>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${username}`}>
                      <span className="text-xl text-gray-600">
                        {name?.length > 0 && surname?.length > 0
                          ? name + " " + surname
                          : username}
                      </span>
                    </Link>

                    <span className="text-lg text-gray-700">{title}</span>
                  </div>
                  <p>{msg}</p>
                  <small>
                    {formatDistanceToNow(new Date(time), { addSuffix: true })}
                  </small>
                </div>
              </div>
            )
          )
        ) : (
          <div>No Notifications Found !!</div>
        )}
      </div>
    </>
  );
};

export default NotificationContainer;
