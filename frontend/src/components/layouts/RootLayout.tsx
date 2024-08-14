// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import { ClerkProvider } from "@clerk/nextjs";
// import { SocketProvider } from "@/context/SocketContext";
// import LayoutSwitcher from "./LayoutSwitcher";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Aman Shaurya Social Media App",
//   description: "Social media app built with Next.js",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ClerkProvider>
//       <SocketProvider>
//         <html lang="en">
//           <body className={inter.className}>
//             <LayoutSwitcher>{children}</LayoutSwitcher>
//           </body>
//         </html>
//       </SocketProvider>
//     </ClerkProvider>
//   );
// }
