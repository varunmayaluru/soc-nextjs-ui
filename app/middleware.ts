import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For a real app, you would check for a valid session/token here
  // This is just a simple example

  // Check if the user is trying to access a protected route
  const isProtectedRoute = !request.nextUrl.pathname.startsWith("/login")

  // For demo purposes, we'll just allow all access
  // In a real app, you would redirect to login if not authenticated

  // Uncomment this to enable authentication protection
  /*
  if (isProtectedRoute) {
    // Check for authentication (this is just a placeholder)
    const isAuthenticated = request.cookies.has('auth_token')
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  */

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
