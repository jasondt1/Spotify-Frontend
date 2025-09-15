import type { CurrentUser, LoginInput, RegisterInput } from "@/dto/auth"
import { api, authHeader } from "@/services/http"

export async function registerUser(input: RegisterInput) {
  const day = Number(input.dob.day)
  const month = Number(input.dob.month)
  const year = Number(input.dob.year)

  const birthday = new Date(
    Date.UTC(year, month - 1, day, 12, 0, 0)
  ).toISOString()

  const payload = {
    email: input.email,
    name: input.name,
    birthday,
    gender: input.gender ?? "",
    password: input.password,
  }

  const { data } = await api.post("/api/auth/register", payload)
  return data
}

export async function loginUser(input: LoginInput) {
  const { data } = await api.post(
    "/api/auth/login",
    {
      email: input.email,
      password: input.password,
    },
    { withCredentials: true }
  )
  return data
}

export async function getCurrentUser(token?: string): Promise<CurrentUser> {
  const { data } = await api.get<CurrentUser>("/api/users/me", {
    headers: authHeader(token),
  })
  return data
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/api/auth/logout", null)
  } catch {}
}

export const authService = {
  register: registerUser,
  login: loginUser,
  me: getCurrentUser,
  logout: logoutUser,
}
