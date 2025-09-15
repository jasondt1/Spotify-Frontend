import React from "react"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: RootLayoutProps) {
  return (
    <main className="min-h-screen w-full ">
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </main>
  )
}
