import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { nowPlayingService } from "@/services/now-playing-service"

import { extractColors } from "@/lib/gradient"

import LyricsClient from "./lyrics-client"

export default async function LyricsPage() {
  const token = cookies().get("access_token")?.value
  if (!token) redirect("/not-found")

  const nowPlaying = await nowPlayingService.fetch(token)
  const coverImage = nowPlaying?.track?.album?.image || ""

  const { dark, mid, light } = coverImage
    ? await extractColors(coverImage)
    : { dark: "#171717", mid: "#2a2a2a", light: "#444" }

  return <LyricsClient color={{ dark, mid, light }} />
}
