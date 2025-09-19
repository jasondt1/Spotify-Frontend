"use client"

import { useEffect, useRef } from "react"
import { usePlayer } from "@/contexts/player-context"

export default function DynamicTitle() {
  const { nowPlaying, isPlaying } = usePlayer()
  const initialTitleRef = useRef<string | null>(null)

  useEffect(() => {
    if (initialTitleRef.current === null) {
      initialTitleRef.current = document.title
    }
  }, [])

  useEffect(() => {
    const track = nowPlaying?.track
    if (track && isPlaying) {
      const artists = (track.artists ?? []).map((a) => a.name).join(", ")
      const title = artists ? `${track.title} • ${artists}` : track.title
      document.title = title
    } else if (initialTitleRef.current) {
      document.title = initialTitleRef.current
    }
  }, [nowPlaying, isPlaying])

  return null
}
