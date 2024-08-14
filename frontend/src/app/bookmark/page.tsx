
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import { ToastContainer, toast } from "react-toastify";
import Bookmarks from "./Bookmarks";
import BottomMenu from "@/components/bottomMenu/BottomMenu";


const Homepage = () => {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
      />

      <div className="flex gap-6 pt-6 pb-24">
        <div className="hidden lg:block lg:w-[10%] xl:w-[20%]">
          <LeftMenu type="home" />
        </div>
        <div className="w-full lg:w-[60%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            <Bookmarks />
          </div>
        </div>
        <div className="hidden lg:block lg:w-[30%] xl:w-[30%]">
          <RightMenu type="home" />
        </div>
      </div>
      <BottomMenu/>
    </>
  );
};

export default Homepage;
