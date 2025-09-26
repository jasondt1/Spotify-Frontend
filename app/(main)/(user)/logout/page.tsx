"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePlayer } from "@/contexts/player-context"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(async () => {
      await fetch("/api/logout", { method: "GET" })

      router.push("/")

      setTimeout(() => {
        window.location.reload()
      }, 100)
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return <p></p>
}
