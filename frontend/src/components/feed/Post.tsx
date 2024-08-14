"use client"

import React, { useState } from "react";
import { Post as PostType, User, Comment } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import PostInfo from "./PostInfo";
import { useAuth } from "@clerk/nextjs";
import { Suspense } from "react";
import Link from "next/link";
type CommentWithUser = Comment & { user: User };
import CommentList from "./CommentList";




type FeedPostType = PostType & { user: User } & {
  likes: [{ userId: string }];
} & { comments: [{ userId: string }] } & { bookmarks: [{ userId: string }] };

const Post = ({
  post,
  setDeletingPostId,
}: {
  post: FeedPostType;
  setDeletingPostId:any;
}) => {
  const { userId, isLoaded } = useAuth();

  const [openComments, setOpenComments] = useState<number>(0);
  const [allComments, setAllComments] = useState<CommentWithUser[]>([]);

  return (
    <div className="flex bg-white flex-col gap-3 p-4 shadow-md rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={post.user.avatar || "/noAvatar.png"}
            className="h-8 w-8 rounded-full cursor-pointer"
          />
          <Link href={`/profile/${post.user.username}`}>
            <span className="text-[20px] text-gray-600 cursor-pointer">
              {post.user.name && post.user.surname
                ? post.user.name + " " + post.user.surname
                : post.user.username}
            </span>
          </Link>
        </div>

        {userId === post.user.id && (
          <PostInfo postId={post.id} setDeletingPostId={setDeletingPostId} />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-96 relative">
            <img
              src={post.img}
              className="object-cover rounded-md w-full h-[500px]"
              alt=""
            />
          </div>
        )}
        <p className="text-gray-600">{post.desc}</p>
      </div>

      {/* Interaction */}

      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id}
          postUser={post.user}
          likes={post.likes.map((like) => like.userId)}
          commentNumber={post.comments.length}
          bookmarks={post.bookmarks.map((temp) => temp.userId)}
          setOpenComments={setOpenComments}
          setAllComments={setAllComments}
        />
      </Suspense>

      {openComments == 1 ? (
        <Suspense fallback="Loading...">
          <CommentList
            comments={allComments}
            postId={post.id}
            postUser={post.user}
          />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Post;
