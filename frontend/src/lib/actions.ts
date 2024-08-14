"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
import { revalidatePath } from "next/cache";
import { z } from "zod";




// *******************For Single User Info (Using in Profile and Profile cards)******************
export const getOneUser = async (uId: string) => {
  const { userId } = auth();
  if (!userId) return;

  try {
    const userInfo = await prisma.user.findUnique({
      where: { id: uId },
    });

    return userInfo;
  } catch (err) {
    console.log(err);
  }
};






// *******************For Searched Users( Using Usernames )******************
export const getSearchedUsers = async (username: string) => {
  const { userId } = auth();
  if (!userId) {
    console.log("User not authenticated");
    return [];
  }

  const searchTerm = username.trim();
  if (!searchTerm) {
    console.log("Search term is empty");
    return [];
  }

  try {
    // Perform a case-insensitive search with additional logic
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: searchTerm,
          mode: "insensitive", 
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });


    const filteredUsers = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("Filtered users:", filteredUsers);
    return filteredUsers;
  } catch (err) {
    console.error("Error fetching users:", err); 
    return [];
  }
};








// *******************For Following and unFollowing******************
export const switchFollow = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};




// *******************For Blocking and UnBlocking******************
export const switchBlock = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};




// ******************* Accepting Follow Requests ********************
export const acceptFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};




// ******************* Deleting Follow Requests ********************
export const declineFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not Authenticated!!");
  }

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};



// ******************* Updating User Profile Info (For Profiles) ********************
export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  const { formData, cover } = payload;
  const fields = Object.fromEntries(formData);

  const filteredFields = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value !== "")
  );

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    surname: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse({ cover, ...filteredFields });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  const { userId } = auth();

  if (!userId) {
    return { success: false, error: true };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};




// ******************* Adding a new Story with expiry time of 24 hours ********************
export const addStory = async (img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }
    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (err) {
    console.log(err);
  }
};



// ******************* For Adding Post ************************
export const addPost = async (formData: FormData, img: string, userId: string) => {

    if (userId.length == 0) {
      if (userId.length == 0) throw new Error("User is not authenticated!");
      return;
    }

    console.log(userId);


  const desc = formData.get("desc") as string;

  const validator = z.string().min(1).max(255);
  const validatedDesc = validator.safeParse(desc);

  if (!validatedDesc.success) {
    console.log("description is not valid");
    return;
  }

  try {
    await prisma.post.create({
      data: {
        userId,
        desc,
        img,
      },
    });

    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};



// ******************* For Deleting Post ************************
export const deletePost = async (postId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};



// ******************* For Deleting Comment ************************
export const deleteComment = async (commentId: string, postId: string) => {
  const { userId } = auth();

  if (!userId) throw new Error("User is not authenticated!");

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
        userId,
        postId
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};




// ******************* For Liking Post ************************
export const switchLike = async (postId: string) => {
  const { userId } = auth();
  if (!userId) {
    console.log("User is not authenticated!");
    return;
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};





// ******************* For Adding and removing Post from BOOKMARKS ************************
export const toggleBookmark = async (userId: string, postId:string) => {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });
    return { action: "removed", bookmark: existingBookmark };
  } else {
    const newBookmark = await prisma.bookmark.create({
      data: {
        userId,
        postId,
      },
      include: {
        user: true,
        post: true,
      },
    });
    return { action: "added", bookmark: newBookmark };
  }
};






// ******************* For Creating New Notification ************************
export const createNotification = async (title: string, message:string="", senderId:string, receiverId:string) => {
  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        senderId,
        receiverId,
        unread: false
      },
    });

    console.log("notification created successfully!!!!");

  } catch (err) {
    console.log(err);
  }
};



// ******************* For Creating new Message ************************
export const createMessage = async(content:string, senderId:string, chatId:string) =>{
  try {

    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId,
        chatId,
      },
    });

    console.log("message Created Successfully")

    // return new Response("message created successfully");
  } catch (error) {
    // return new Response("message created successfully");
  }
}
