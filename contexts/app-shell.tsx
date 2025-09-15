"use client"

import { usePathname } from "next/navigation"

import { SiteHeader } from "@/components/site-header"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const hideHeader = pathname === "/sign-up" || pathname === "/login"

  return (
    <div className="relative flex min-h-screen flex-col">
      {!hideHeader && <SiteHeader />}
      <div className="flex-1">{children}</div>
    </div>
  )
}
