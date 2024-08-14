

"use client";

// import { Post as PostType, User, Comment } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import { useEffect, useOptimistic, useState } from "react";
type CommentWithUser = Comment & { user: User };
import Helper from "./Helper";
import { useSocket } from "@/context/SocketContext";
import { createNotification } from "@/lib/actions";
import {useAuth} from "@clerk/nextjs"

const CommentList = ({
  comments,
  postId,
  postUser,
}: {
  comments: CommentWithUser[];
  postId: string;
  postUser: User;
}) => {
  const socket = useSocket();

  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [commentState, setCommentState] = useState<CommentWithUser[]>([]);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    setCommentState(comments);
  }, [comments]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/getComments/${postId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fetchedComments: CommentWithUser[] = await response.json();
      setCommentState(fetchedComments);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  console.log(postUser.id);
  console.log(userId);

  const add = async () => {
    if (!user || !desc) return;

    // Optimistically add the comment with the user details
    const optimisticComment: CommentWithUser = {
      id: `${Math.random()}`,
      desc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId: postId,
      user: {
        id: user.id,
        // username: user.username || "",
        username: "Sending Please Wait...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: user.firstName || "",
        surname: user.lastName || "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },
    };

    addOptimisticComment(optimisticComment);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, desc }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const createdComment: CommentWithUser = await response.json();

      setCommentState((prev) =>
        prev.map((comment) =>
          comment.id === optimisticComment.id ? createdComment : comment
        )
      );

      await fetchComments();

  

      if(postUser.id != userId){
        const commentNotificationData = {
          senderUserId: userId,
          receiverUserId: postUser.id,
          title: "commented on your post",
          msg: desc,
          time: new Date().toISOString(),
        };
        socket?.emit("send_notification", commentNotificationData);

        await createNotification(
          "commented on your post",
          desc,
          userId || "",
          postUser.id
        );
      }


    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  );

  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <img
            src={user.imageUrl || "noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            action={add}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              onChange={(e) => setDesc(e.target.value)}
            />
            <img
              src="/emoji.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </form>
        </div>
      )}

      <Helper comments={optimisticComments} postId={postId} />
    </>
  );
};

export default CommentList;
