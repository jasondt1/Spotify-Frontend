import Cookies from "js-cookie"

export const TOKEN_KEY = "access_token"
export const USER_KEY = "current_user"

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  try {
    return Cookies.get(name) ?? null
  } catch {
    return null
  }
}

export function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return
  try {
    Cookies.set(name, value, { expires: days, path: "/" })
  } catch {}
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  try {
    Cookies.remove(name, { path: "/" })
  } catch {}
}

