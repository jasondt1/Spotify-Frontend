import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://api-gateway-spotify-153611945963.asia-southeast2.run.app"

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

export function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

api.interceptors.request.use((config) => {
  try {
    if (typeof document !== "undefined") {
      const t = Cookies.get("access_token")
      if (t) {
        const h: any = config.headers
        if (h && typeof h.set === "function") {
          h.set("Authorization", `Bearer ${t}`)
        } else {
          config.headers = {
            ...(config.headers as any),
            Authorization: `Bearer ${t}`,
          } as any
        }
      }
    }
  } catch {}
  return config
})
