"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import type { CurrentUser } from "@/dto/auth"
import { authService } from "@/services/auth-service"

import {
  TOKEN_KEY,
  USER_KEY,
  deleteCookie,
  getCookie,
  setCookie,
} from "@/lib/cookies"

type AuthContextType = {
  user: CurrentUser | null
  token: string | null
  setToken: (t: string | null) => void
  refresh: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getCookie(TOKEN_KEY))
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    const raw = getCookie(USER_KEY)
    if (!raw) return
    try {
      setUser(JSON.parse(raw) as CurrentUser)
    } catch {
      deleteCookie(USER_KEY)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const me = await authService.me(token ?? undefined)
      setUser(me)
      setCookie(USER_KEY, JSON.stringify(me))
    } catch (e) {
      setUser(null)
      deleteCookie(USER_KEY)
    }
  }, [token])

  useEffect(() => {
    refresh()
  }, [refresh])

  const setToken = (t: string | null) => {
    setTokenState(t)
    if (t) setCookie(TOKEN_KEY, t)
    else deleteCookie(TOKEN_KEY)
  }

  const logout = () => {
    try {
      authService.logout()
    } catch {}
    setTokenState(null)
    setUser(null)
    deleteCookie(USER_KEY)
    deleteCookie(TOKEN_KEY)
  }

  const value: AuthContextType = { user, token, setToken, refresh, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
