"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getLyrics, getSong } from "genius-lyrics-api"

import { Input } from "@/components/ui/input"

export function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setQuery("")
    }
  }, [pathname])

  useEffect(() => {
    if (!query) return
    const handler = setTimeout(() => {
      router.push(`/search/${encodeURIComponent(query)}`)
    }, 500)

    return () => clearTimeout(handler)
  }, [query, router])

  return (
    <Input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="What do you want to play?"
      className="px-12 rounded-full bg-neutral-900 w-96 h-12 border border-transparent focus:border-white focus:ring-2 focus:ring-white"
    />
  )
}
