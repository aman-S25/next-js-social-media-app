
"use client";
import { addPost } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@clerk/nextjs";

const AddPost = () => {

  const { userId, sessionId, getToken } = useAuth();

  const {user, isLoaded} = useUser()
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState<any>();

  if(!isLoaded){return "Loading..."}

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const formData = new FormData(e.currentTarget);

  //   await addPost(formData);

    // window.location.reload();
  //   setDesc("");
  // };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      <img
        src={user?.imageUrl || "/noAvatar.png"}
        alt=""
        className="h-12 w-12 rounded-full object-cover relative top-3"
      />

      <div className="flex-1 flex flex-col  gap-3 text-gray-600">
        {/* <form onSubmit={handleSubmit} className="w-full"> */}
        <form
          action={(formData) =>
            addPost(formData, img?.secure_url || "", userId || "").then(() => {setDesc(""); setImg(null);window.location.reload();})
          }
          className="w-full flex gap-3"
        >
          <textarea
            name="desc"
            placeholder="What's on your mind"
            className="border-0 p-2 focus:outline-none bg-slate-100 h-16 rounded-lg w-full"
            onChange={(e) => setDesc(e.target.value)}
          />

          <button
            type="submit"
            className="bg-slate-100 w-20 rounded-lg text-blue-500 hover:text-green-500"
          >
            Post
          </button>
        </form>

        <div className="flex gap-6 items-center ">


          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              console.log(img);
              widget.close();
            }}
          >
            {({ open }) => {
              return (

                <div
                  className="flex items-center gap-1"
                  onClick={() => open()}>
                    <img src="/Photo3.png" alt="" className="h-8 w-8 cursor-pointer" />
                    <span>Photo</span>
                </div>
              );
            }}
          </CldUploadWidget>

        </div>
      </div>
    </div>
  );
};

export default AddPost;
