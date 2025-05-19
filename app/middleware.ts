import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is trying to access a protected route
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isProtectedRoute =
    !isAuthRoute &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.includes(".");

  // Get the auth token from cookies or Authorization header
  const authToken = request.cookies.get("authToken")?.value;
  const authHeader = request.headers.get("Authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;
  const token = authToken || tokenFromHeader;

  // If no token and trying to access protected route, redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists, verify it's not expired
  if (token) {
    try {
      // Check token expiration
      let tokenToCheck = token;
      if (tokenToCheck.startsWith("Bearer ")) {
        tokenToCheck = tokenToCheck.substring(7);
      }

      const base64Url = tokenToCheck.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const decodedToken = JSON.parse(jsonPayload);
      const { exp } = decodedToken;

      if (exp && Date.now() >= exp * 1000) {
        // Token is expired, redirect to login
        console.log("Middleware: Token expired, redirecting to login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // For admin routes, make a server-side API call to verify admin status
      if (isAdminRoute) {
        // We need to make a server-side API call to verify admin status
        // Since middleware doesn't support async/await directly, we'll use a header-based approach
        // The client-side AdminProtectedRoute component will handle the actual verification

        // Add a header to indicate this route requires admin verification
        const response = NextResponse.next();
        response.headers.set("x-requires-admin", "true");
        return response;
      }
    } catch (error) {
      // Error parsing token, consider it invalid
      console.error("Middleware: Error parsing token", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
