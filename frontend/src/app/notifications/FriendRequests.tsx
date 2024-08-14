"use client"

import { useAuth } from "@clerk/nextjs";
import FriendRequestList from "./FriendRequestList";
import { useEffect, useState } from "react";

const FriendRequests = () => {

  const [requests, setRequests] = useState<any[]>([])

  const fetchRequests = async () => {
    try {
      const temp = await fetch(`/api/followRequests/`);
      if (!temp.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await temp.json();
      setRequests(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []); 




  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">

      {requests.length ? (
        <FriendRequestList requests={requests} />
      ) : (
        <div>No Requests Found !!!</div>
      )}
    </div>
  );
};

export default FriendRequests;
