import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

export async function verifyToken(token?: string) {
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const payload = await verifyToken(token)

  const { pathname } = req.nextUrl

  if (
    payload &&
    (pathname.startsWith("/login") || pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (!payload && pathname.startsWith("/account-settings")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/admin")) {
    if (!payload) {
      return NextResponse.redirect(new URL("/not-found", req.url))
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/not-found", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/sign-up", "/account-settings", "/admin/:path*"],
}
