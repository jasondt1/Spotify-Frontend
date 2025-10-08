import { NextRequest, NextResponse } from "next/server"

import { authService } from "@/services/auth-service"
import { TOKEN_KEY } from "@/lib/cookies"

export async function GET(req: NextRequest) {
  try {
    const { token } = await authService.dummy()
    const next = req.nextUrl.searchParams.get("next") ?? "/"
    const res = NextResponse.redirect(new URL(next, req.url))
    res.cookies.set(TOKEN_KEY, token, {
      httpOnly: false,
      path: "/",
    })
    return res
  } catch (e) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

