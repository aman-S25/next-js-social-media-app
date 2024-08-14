"use client";

import { deletePost } from "@/lib/actions";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostInfo = ({
  postId,
  setDeletingPostId,
}: {
  postId: string;
  setDeletingPostId: any;
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const deletePostWithId = async () => {
    try {
      await deletePost(postId);

      // Display success toast message
      toast.success("Post has been deleted successfully!");
      setDeletingPostId(postId)
      // window.location.reload();
    } catch (err) {
      console.error("Failed to delete post:", err);

      // Display error toast message
      toast.error("Failed to delete post. Please try again.");
    }
  };

  return (
    <>
      <div className="relative">
        <img
          src="/more.png"
          width={16}
          height={16}
          alt=""
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer"
        />
        {open && (
          <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
            <form action={() => deletePostWithId()}>
              <button className="text-red-500">Delete</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default PostInfo;
