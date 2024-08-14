// import { useRouter } from "next/router";
// import MainLayout from "./MainLayout";
// import ChatLayout from "./ChatLayout";

// const LayoutSwitcher = ({ children }:{children:any}) => {
//   const router = useRouter();
//   const chatRoutes = ["/chat"]; // Add other routes that should use the ChatLayout

//   const isChatRoute = chatRoutes.includes(router.pathname);

//   return isChatRoute ? (
//     <ChatLayout>{children}</ChatLayout>
//   ) : (
//     <MainLayout>{children}</MainLayout>
//   );
// };

// export default LayoutSwitcher;
