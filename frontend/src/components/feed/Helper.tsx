"use client"

import { deleteComment } from "@/lib/actions";
import { Comment, User } from "@prisma/client";
type CommentWithUser = Comment & { user: User };
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";


const Helper = ({
  comments,
  postId
}: {
  comments: CommentWithUser[];
  postId: string;
}) => {


  // const [open, setOpen] = useState(false);

  // const deletePostWithId = async (commentId: string) => {
  //   try {
  //     await deleteComment(commentId, postId); // Call the function with postId

  //     console.log("Hello there");

  //     // Display success toast message
  //     toast.success("Comment has been deleted successfully!");
  //   } catch (err) {
  //     console.error("Failed to delete post:", err);

  //     // Display error toast message
  //     toast.error("Failed to delete post. Please try again.");
  //   }
  // };


  return (
    <div className="">
      {comments.map((comment) => (
        <div className="flex gap-4 justify-between mt-6" key={comment.id}>
          <Link href={`/profile/${comment?.user.username}`}>
            <img
              src={comment.user.avatar || "noAvatar.png"}
              alt=""
              width={40}
              height={40}
              className="w-6 h-6 rounded-full"
            />
          </Link>

          <div className="flex flex-col flex-1">
            <div className="flex flex-col gap-1">
              <Link href={`/profile/${comment?.user.username}`}>
                <span className="font-medium text-gray-600">
                  {comment.user.name && comment.user.surname
                    ? comment.user.name + " " + comment.user.surname
                    : comment.user.username}
                </span>
              </Link>

              <div className="">
                <p className="text-gray-600 whitespace-normal break-words leading-relaxed">
                  {comment.desc}
                </p>
              </div>
            </div>
            {/* <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <img
                src="/like.png"
                alt=""
                className="cursor-pointer w-3 h-3"
              />
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">0 Likes</span>
            </div> */}
          </div>

          {/* ICON */}
          {/* <div className="relative">
            <img
              src="/more.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
              onClick={() => setOpen((prev) => !prev)}
            />

            {open && (
              <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
                <form action={() => deletePostWithId(comment.id)}>
                  <button className="text-red-500">Delete</button>
                </form>
              </div>
            )}
          </div> */}
          <small>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Helper


