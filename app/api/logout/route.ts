import { NextResponse } from "next/server"

import { TOKEN_KEY } from "@/lib/cookies"

export async function GET() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(TOKEN_KEY, "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  })
  return res
}
