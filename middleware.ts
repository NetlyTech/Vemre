import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/admin/dashboard", "/admin/users", "/admin/kyc", "/admin/transactions", "/admin/fx", "/admin/export", "/admin/settings", "/admin/requests", "/admin/admins"]
const authRoute = "/admin/login"

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAuthRoute = path.startsWith(authRoute)

  const authCookie = req.cookies.get("auth")?.value
  const isAuthenticated = authCookie === "authenticated"

  // Redirect unauthenticated users away from protected admin routes
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/admin/login", req.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
