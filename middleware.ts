import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAuth = Boolean(token);

  // Only protect specific routes
  const protectedPaths = ["/communication", "/education", "/profile"];
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // If trying to access protected route without auth, redirect to signin
  if (!isAuth && isProtected) {
    const loginUrl = new URL("/signin", request.url);
    // preserve return path for smooth redirect back after auth
    loginUrl.searchParams.set("next", pathname);
    console.log(`Redirecting to login with next: ${pathname}`); // Debug log
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and trying to access auth pages, redirect to home
  if (isAuth && (pathname === "/signin" || pathname === "/signup")) {
    const homeUrl = new URL("/", request.url);
    console.log(`Already authenticated, redirecting to home`); // Debug log
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/communication/:path*", "/education/:path*", "/profile/:path*", "/signin", "/signup"],
};


