import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/settings(.*)", // Matches /settings and any route under /settings
  "/", // Matches the root path
  "/profile(.*)", // Matches /profile and any route under /profile
  "/bookmark(.*)",
  "/messages(.*)", 
  "/notifications(.*)", 
  "/search(.*)",

]);



export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};






