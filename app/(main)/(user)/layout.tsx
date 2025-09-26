import { cookies } from "next/headers"
import { PlayerProvider } from "@/contexts/player-context"
import { UserProvider } from "@/contexts/user-context"
import { TrackResponseDto } from "@/dto/artist"
import { LibraryResponseDto } from "@/dto/library"
import { NowPlayingResponseDto } from "@/dto/now-playing"
import { PlaylistResponseDto } from "@/dto/playlist"
import { QueueItemResponseDto } from "@/dto/queue"
import { verifyToken } from "@/middleware"
import { libraryService } from "@/services/library-service"
import { likedService } from "@/services/liked-service"
import { nowPlayingService } from "@/services/now-playing-service"
import { playlistService } from "@/services/playlist-service"
import { queueService } from "@/services/queue-service"

import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import BottomPlayer from "@/components/bottom-player"
import DynamicTitle from "@/components/dynamic-title"
import ResizableMainWrapper from "@/components/resizable-main-wrapper"
import { SiteHeader } from "@/components/site-header"

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const token = cookies().get("access_token")?.value
  const payload = await verifyToken(token)
  const validToken = payload ? token : null

  let initialPlaylists: PlaylistResponseDto[] = []
  let initialLikedTracks: TrackResponseDto[] = []
  let initialLibraries: LibraryResponseDto[] = []
  let initialQueue: QueueItemResponseDto[] = []
  let initialNowPlaying: NowPlayingResponseDto | null = null

  if (validToken) {
    try {
      initialPlaylists = await playlistService.getMine(token)
    } catch {}
    try {
      initialLikedTracks = await likedService.getAll(token)
    } catch {}
    try {
      initialLibraries = await libraryService.fetch(token)
    } catch {}
    try {
      initialQueue = await queueService.fetch(token)
    } catch {}
    try {
      initialNowPlaying = await nowPlayingService.fetch(token)
    } catch {}
  }

  return (
    <TooltipProvider>
      <UserProvider
        initialPlaylists={initialPlaylists}
        initialLikedTracks={initialLikedTracks}
        initialLibraries={initialLibraries}
      >
        <PlayerProvider
          initialQueue={initialQueue}
          initialNowPlaying={initialNowPlaying}
        >
          <SiteHeader />

          <ResizableMainWrapper token={validToken!}>
            {children}
          </ResizableMainWrapper>

          {!validToken && (
            <div className="fixed bottom-2 left-2 right-2 z-50">
              <div className="flex items-center justify-between bg-gradient-to-r from-[#af2896] via-[#509bf5] to-[#2696f5] px-6 py-4">
                <div className="flex flex-col">
                  <p className="text-white text-sm font-bold">
                    Preview of Spotify
                  </p>
                  <p className="text-white text-md font-medium opacity-90">
                    Sign up to get unlimited songs and podcasts with occasional
                    ads. No credit card needed.
                  </p>
                </div>
                <button className="ml-8 rounded-full bg-white px-8 py-3 text-sm font-bold text-black hover:scale-105 hover:bg-gray-100 transition-all duration-200 whitespace-nowrap">
                  Sign up free
                </button>
              </div>
            </div>
          )}

          {validToken && <BottomPlayer />}
          <DynamicTitle />
          <Toaster />
        </PlayerProvider>
      </UserProvider>
    </TooltipProvider>
  )
}
