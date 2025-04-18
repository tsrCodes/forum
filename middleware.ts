import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthenticated = !!token;
    const isAuthPage = 
      req.nextUrl.pathname.startsWith("/auth") || 
      req.nextUrl.pathname.startsWith("/auth/register");

    if (isAuthenticated && isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/forums/create",
    "/forums/edit/:path*",
    "/auth",
    "/auth/register",
  ],
};