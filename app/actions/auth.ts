import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { CurrentUser } from "@/dto/auth"
import { authService } from "@/services/auth-service"

import { TOKEN_KEY, USER_KEY } from "@/lib/cookies"

export async function loginAction(email: string, password: string) {
  const { token, user } = await authService.login({ email, password })
  const cookieStore = cookies()
  cookieStore.set(TOKEN_KEY, token, { httpOnly: false, path: "/" })
  cookieStore.set(USER_KEY, JSON.stringify(user), {
    httpOnly: false,
    path: "/",
  })
  redirect("/admin")
}

export async function logoutAction() {
  const cookieStore = cookies()
  cookieStore.set(TOKEN_KEY, "", { maxAge: 0, path: "/" })
  cookieStore.set(USER_KEY, "", { maxAge: 0, path: "/" })
  redirect("/login")
}

export function getCurrentUser(): CurrentUser | null {
  const cookieStore = cookies()
  const raw = cookieStore.get(USER_KEY)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as CurrentUser
  } catch {
    return null
  }
}
