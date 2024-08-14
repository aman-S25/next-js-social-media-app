"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Post from "./Post";

const Feed = ({ username }: { username?: string }) => {

  const { userId, isLoaded } = useAuth();

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [followingPosts, setFollowingPosts] = useState<any[]>([]);
  const [profilePosts, setProfilePosts] = useState<any[]>([]);

  const [deletingPostId, setDeletingPostId] = useState<string>();
  
  const [myFlag, setMyFlag] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (username) {
          const profileResponse = await fetch(`/api/profilePosts/${username}/`);
          if (!profileResponse.ok) {
            throw new Error("Network response was not ok");
          }
          const fetchedPosts = await profileResponse.json();
          setProfilePosts(fetchedPosts);

        } else if (userId) {
          const followingResponse = await fetch(`/api/followingPosts/`);
          if (!followingResponse.ok) {
            throw new Error("Network response was not ok");
          }
          const fetchedPosts = await followingResponse.json();
          setFollowingPosts(fetchedPosts);
        }

        const allPostsResponse = await fetch(`/api/allPosts/`);
        if (!allPostsResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedPosts = await allPostsResponse.json();
        setAllPosts(fetchedPosts);


      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (isLoaded) {
      fetchPosts();
    }
  }, [username, userId, isLoaded]);


  useEffect(()=>{}, [myFlag])

  useEffect(()=>{
    
    const filteredAllPosts = allPosts.filter((post) => post.id !== deletingPostId);
    setAllPosts(filteredAllPosts);
    
    const filteredProfilePosts = profilePosts.filter((post) => post.id !== deletingPostId);
    setProfilePosts(filteredProfilePosts);
    
    const filteredFollowingPosts = followingPosts.filter((post) => post.id !== deletingPostId);
    setFollowingPosts(filteredFollowingPosts);

  },[deletingPostId])



  return (
    <>
      {username ? (
        <div className="flex flex-col gap-6">
          {profilePosts.length
            ? profilePosts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  setDeletingPostId={setDeletingPostId}
                />
              ))
            : "No posts found!"}
        </div>
      ) : (
        <div className="flex flex-col ">
          <div className="flex rounded-lg bg-white mb-4 border-spacing-2">
            <div
              className={`flex-1 p-4 border-2 text-center cursor-pointer ${
                myFlag == false ? "border-2" : "border-none"
              }`}
              onClick={() => setMyFlag(false)}
            >
              For You
            </div>
            <div
              className={`flex-1 p-4 border-2 text-center cursor-pointer ${
                myFlag == true ? "border-2" : "border-none"
              }`}
              onClick={() => setMyFlag(true)}
            >
              Following Posts
            </div>
          </div>

          {myFlag == false ? (
            <div className="flex flex-col gap-6">
              {allPosts.length
                ? allPosts.map((post) => (
                    <Post
                      key={post.id}
                      post={post}
                      setDeletingPostId={setDeletingPostId}
                    />
                  ))
                : "No posts found!"}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {followingPosts
                ? followingPosts.map((post) => (
                    <Post
                      key={post.id}
                      post={post}
                      setDeletingPostId={setDeletingPostId}
                    />
                  ))
                : "No posts found!"}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Feed;

