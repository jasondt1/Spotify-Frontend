import { cookies } from "next/headers"
import { PlayerProvider } from "@/contexts/player-context"
import { UserProvider } from "@/contexts/user-context"
import { TrackResponseDto } from "@/dto/artist"
import { LibraryResponseDto } from "@/dto/library"
import { NowPlayingResponseDto } from "@/dto/now-playing"
import { PlaylistResponseDto } from "@/dto/playlist"
import { QueueItemResponseDto } from "@/dto/queue"
import { libraryService } from "@/services/library-service"
import { likedService } from "@/services/liked-service"
import { nowPlayingService } from "@/services/now-playing-service"
import { playlistService } from "@/services/playlist-service"
import { queueService } from "@/services/queue-service"

import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import BottomPlayer from "@/components/bottom-player"
import { HoverWrapper } from "@/components/hover-wrapper"
import { SiteHeader } from "@/components/site-header"
import YourLibrary from "@/components/your-library"
import YourQueue from "@/components/your-queue"
import DynamicTitle from "@/components/dynamic-title"

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const token = cookies().get("access_token")?.value
  let initialPlaylists: PlaylistResponseDto[] = []
  let initialLikedTracks: TrackResponseDto[] = []
  let initialLibraries: LibraryResponseDto[] = []
  let initialQueue: QueueItemResponseDto[] = []
  let initialNowPlaying: NowPlayingResponseDto | null = null

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
          <div className="flex gap-2 px-2 font-medium">
            <div className="sidebar w-[22.5%]">
              <YourLibrary />
            </div>
            <HoverWrapper className="w-[55%]">{children}</HoverWrapper>
            <div className="right-scroll-group sidebar w-[22.5%]">
              <YourQueue />
            </div>
          </div>
          <BottomPlayer />
          <DynamicTitle />
          <Toaster />
        </PlayerProvider>
      </UserProvider>
    </TooltipProvider>
  )
}
