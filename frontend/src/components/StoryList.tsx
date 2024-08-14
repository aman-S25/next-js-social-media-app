


"use client"


import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Story, User } from "@prisma/client";
import { addStory } from "@/lib/actions";
import { useOptimistic } from "react";
import { useUser } from "@clerk/nextjs";

type StoryWithUser = Story & {
  user: User;
};

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>();
  const [selectedStory, setSelectedStory] = useState<StoryWithUser | null>(
    null
  );

  const { user, isLoaded } = useUser();

  const add = async () => {
    if (!img?.secure_url) return;

    addOptimisticStory({
      id: `${Math.random()}`,
      img: img.secure_url,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: "Sending...",
        avatar: user?.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },
    });

    try {
      const createdStory = await addStory(img.secure_url);
      setStoryList((prev) => [createdStory!, ...prev]);
      setImg(null);
    } catch (err) {}
  };

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value: StoryWithUser) => [value, ...state]
  );

  const handleStoryClick = (story: StoryWithUser) => {
    setSelectedStory(story);
  };

  return (
    <>
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer relative"
            onClick={() => open()}
          >
            <img
              src={img?.secure_url || user?.imageUrl || "/noAvatar.png"}
              alt=""
              width={80}
              height={80}
              className="w-20 h-20 rounded-full ring-2 object-cover"
            />
            {img ? (
              <form action={add}>
                <button className="text-xs bg-blue-500 p-1 rounded-md text-white">
                  Send
                </button>
              </form>
            ) : (
              <span className="font-medium">Add a Story</span>
            )}
            <div
              className="absolute text-6xl text-gray-200 top-1"
              onClick={() => open()}
            >
              +
            </div>
          </div>
        )}
      </CldUploadWidget>
      {/* STORY */}
      {optimisticStories.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          key={story.id}
          onClick={() => handleStoryClick(story)}
        >
          <img
            src={story.user.avatar || "/noAvatar.png"}
            alt=""
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}

      {/* Modal for Viewing Story */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-sm z-60">
            <img
              src={selectedStory.img}
              alt="Story"
              className="w-full h-auto rounded-lg"
            />
            <button
              className="mt-2 bg-red-500 text-white p-2 rounded"
              onClick={() => setSelectedStory(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryList;
