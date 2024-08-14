"use client";

import { switchLike } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { useOptimistic, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import {toggleBookmark} from "@/lib/actions";
import { Post as PostType, User, Comment } from "@prisma/client";
type CommentWithUser = Comment & { user: User };
import { io } from "socket.io-client";
import { useSocket } from "@/context/SocketContext";
import {createNotification} from "@/lib/actions";



// interface notificationDataTypes {
//   user: string;
//   title: String;
//   msg: String;
//   time: String;
// }


const PostInteraction = ({
  postId,
  postUser,
  likes,
  commentNumber,
  bookmarks,
  setOpenComments,
  setAllComments,
}: {
  postId: string;
  postUser: User;
  likes: string[];
  commentNumber: number;
  bookmarks: string[];
  setOpenComments: Dispatch<SetStateAction<number>>;
  setAllComments: Dispatch<SetStateAction<CommentWithUser[]>>;
}) => {
  const socket = useSocket();

  const { isLoaded, userId } = useAuth();

  const toggleComments = () => {
    setOpenComments((prev) => (prev === 0 ? 1 : 0));
  };

  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  });

  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state, value) => {
      return {
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      };
    }
  );

  const likeAction = async () => {
    switchOptimisticLike("");
    try {
      switchLike(postId);
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));

      if (likeState.isLiked == false && postUser.id != userId) {
        if (socket) {
          const msgData = {
            senderUserId: userId,
            receiverUserId:postUser.id,
            title: "liked your post",
            msg: "",
            time: new Date().toISOString(),
          };
          socket.emit("send_notification", msgData);
        }

        const temp = await createNotification(
          "liked your post",
          "",
          userId || "",
          postUser.id
        );
      }
    } catch (err) {}
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/getComments/${postId}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const fetchedComments: CommentWithUser[] = await response.json();
      setAllComments(fetchedComments);
    } catch (err) {
      setError("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  // const [comment]

  // console.log("I am here");
  // console.log(bookmarks)

  const [isBookmarked, setBookmarked] = useState(
    bookmarks.includes(userId || "") ? true : false
  );

  const handleBookmark = async () => {
    setBookmarked(!isBookmarked);

    try {
      await toggleBookmark(userId || "", postId);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <form action={likeAction}>
            {/* <button onClick={handleClick}> */}
            <button>
              <img
                src={optimisticLike.isLiked ? "/liked.png" : "/like.png"}
                width={16}
                height={16}
                alt=""
                className="cursor-pointer"
              />
            </button>
          </form>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {optimisticLike.likeCount}
            <span className="hidden md:inline cursor-pointer"> Likes</span>
          </span>
        </div>
        <div
          className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl"
          onClick={() => {
            toggleComments();
            fetchComments();
          }}
        >
          <img
            src="/comment.png"
            width={16}
            height={16}
            alt=""
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {commentNumber}
            <span className="hidden md:inline cursor-pointer"> Comments</span>
          </span>
        </div>
      </div>
      <div className="">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <img
            src={isBookmarked ? `/bookBlue.png` : `/book.png`}
            width={16}
            height={16}
            alt=""
            className="cursor-pointer"
            onClick={handleBookmark}
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            <span className="hidden md:inline cursor-pointer"> Bookmark</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;
