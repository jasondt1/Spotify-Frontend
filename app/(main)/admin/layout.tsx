import React from "react"

import { AdminHeader } from "@/components/admin-header"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: RootLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-neutral-900">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </main>
  )
}
