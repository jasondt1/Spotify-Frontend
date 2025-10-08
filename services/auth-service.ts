import type {
  ChangePasswordInput,
  CurrentUser,
  LoginInput,
  RegisterInput,
} from "@/dto/auth"
import { api, authHeader } from "@/services/http"

async function registerUser(input: RegisterInput) {
  try {
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
  } catch (err) {
    throw err
  }
}

async function loginUser(input: LoginInput) {
  try {
    const { data } = await api.post(
      "/api/auth/login",
      {
        email: input.email,
        password: input.password,
      },
      { withCredentials: true }
    )
    return data
  } catch (err) {
    throw err
  }
}

async function dummyLogin() {
  try {
    const { data } = await api.post("/api/auth/auto-login", {
      withCredentials: true,
    })
    return data
  } catch (err) {
    throw err
  }
}

async function getCurrentUser(token?: string): Promise<CurrentUser> {
  try {
    const { data } = await api.get<CurrentUser>("/api/users/me", {
      headers: authHeader(token),
    })
    return data
  } catch (err) {
    throw err
  }
}

async function logoutUser(): Promise<void> {
  try {
    await api.post("/api/auth/logout", null)
  } catch (err) {
    throw err
  }
}

async function changePassword(input: ChangePasswordInput): Promise<void> {
  try {
    await api.post("/api/auth/change-password", input, {
      withCredentials: true,
    })
  } catch (err) {
    throw err
  }
}

export const authService = {
  register: registerUser,
  login: loginUser,
  dummy: dummyLogin,
  me: getCurrentUser,
  logout: logoutUser,
  changePassword,
}
