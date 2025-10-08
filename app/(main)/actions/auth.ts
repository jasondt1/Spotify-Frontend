"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { CurrentUser } from "@/dto/auth"
import { authService } from "@/services/auth-service"

import { TOKEN_KEY } from "@/lib/cookies"

export async function login(email: string, password: string) {
  const { token } = await authService.login({ email, password })
  const cookieStore = cookies()
  cookieStore.set(TOKEN_KEY, token, { httpOnly: false, path: "/" })
  redirect("/")
}

export async function dummyLogin() {
  const { token } = await authService.dummy()
  const cookieStore = cookies()
  cookieStore.set(TOKEN_KEY, token, { httpOnly: false, path: "/" })
  redirect("/")
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.set(TOKEN_KEY, "", { maxAge: 0, path: "/" })
  redirect("/")
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(TOKEN_KEY)?.value
  if (!token) return null

  try {
    return await authService.me(token)
  } catch (e) {
    return null
  }
}
