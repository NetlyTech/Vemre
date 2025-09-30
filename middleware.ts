import { type NextRequest, NextResponse } from "next/server"

// Define protected and public routes
const protectedRoutes = ["/dashboard", "/transactions"]
const publicRoutes = ["/login", "/"]


export default async function middleware(req: NextRequest) {
    
  // Get the pathname of the request
  const path = req.nextUrl.pathname;

  // Check if the current route is protected or public
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => path === route)

  // Get the authentication cookie
  const authCookie = req.cookies.get("auth")?.value
  const isAuthenticated = authCookie === "authenticated";

  


//   // If the route is protected and the user is not authenticated, redirect to homepage
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/", req.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

//   // If the route is public (like login) and the user is authenticated, redirect to dashboard
  // if (isPublicRoute && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url))
  // }

//   // If the path is the root and the user is authenticated, redirect to dashboard
  // if (path === "/" && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url))
  // }

//   // If the path is the root and the user is not authenticated, redirect to login
  // if (path === "/" && !isAuthenticated) {
  //   return NextResponse.redirect(new URL("/login", req.url))
  // }

// stop here

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
