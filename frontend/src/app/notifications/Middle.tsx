

"use client";
import NotificationConatiner from "./NotificationConatiner";
import FriendRequests from "./FriendRequests";
import { useState, useEffect } from "react";

const Homepage = () => {
  const [Open, setOpen] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <div
          className={`flex-1 flex items-center justify-around p-4 bg-white text-2xl rounded-lg shadow-sm cursor-pointer ${
            Open ? "border-2" : "none"
          }`}
          onClick={() => {
            setOpen(1);
          }}
        >
          <h1 className="text-gray-600">Notifications</h1>
        </div>
        <div
          className={`flex-1 flex items-center justify-around p-4 bg-white text-2xl rounded-lg shadow-sm cursor-pointer ${
            !Open ? " border-2" : "none"
          }`}
          onClick={() => {
            setOpen(0);
          }}
        >
          <h1 className="text-gray-600">Follow Requests</h1>
        </div>
      </div>
      <div className={`${!Open ? "hidden" : "none"}`}>
        <NotificationConatiner />
      </div>
      <div className={`${Open ? "hidden" : "none"}`}>
        <FriendRequests />
      </div>
    </div>
  );
};

export default Homepage;
