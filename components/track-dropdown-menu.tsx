"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePlayer } from "@/contexts/player-context"
import { useUser } from "@/contexts/user-context"
import type { TrackResponseDto } from "@/dto/artist"
import { playlistService } from "@/services/playlist-service"
import { queueService } from "@/services/queue-service"
import { BsThreeDots } from "react-icons/bs"
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineQueueList,
  HiOutlineTrash,
} from "react-icons/hi2"

import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TrackDropdownMenuProps = {
  track: TrackResponseDto
  playlistId?: string
  queueId?: string
}

export function TrackDropdownMenu({
  track,
  playlistId,
  queueId,
}: TrackDropdownMenuProps) {
  const { playlists, fetchPlaylists, fetchLibraries } = useUser()
  const { fetchQueue } = usePlayer()
  const [alertOpen, setAlertOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleCreatePlaylist = async () => {
    try {
      await playlistService.create({
        name: track.title,
        description: "",
        image: "",
        trackIds: [track.id],
      })
      await fetchLibraries()
      await fetchPlaylists()
      toast({ description: `Successfully created playlist.` })
    } catch (err) {
      console.error("Failed to create playlist:", err)
    }
  }

  const handleAddTrackToPlaylist = async (playlistId: string) => {
    try {
      await playlistService.addTrack(playlistId, track.id)
      toast({ description: `Successfully added to the playlist.` })
      await fetchLibraries()
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setAlertOpen(true)
      } else {
        console.error("Failed to add track to playlist:", err)
      }
    }
  }

  const handleRemoveTrackFromPlaylist = async () => {
    if (!playlistId) return
    try {
      await playlistService.removeTrack(playlistId, track.id)
      toast({ description: `Successfully removed from the playlist.` })
      await fetchLibraries()
      router.refresh()
    } catch (err) {
      console.error("Failed to remove track from playlist:", err)
    }
  }

  const handleAddToQueue = async () => {
    try {
      await queueService.addTrack(track.id)
      toast({
        description: `Successfully added "${track.title}" to the queue.`,
      })
      await fetchQueue()
    } catch (err) {
      console.error("Failed to add track to queue:", err)
    }
  }

  const handleRemoveFromQueue = async () => {
    if (!queueId) return
    try {
      await queueService.remove(queueId)
      toast({
        description: `Successfully removed "${track.title}" from the queue.`,
      })
      await fetchQueue()
    } catch (err) {
      console.error("Failed to remove track from queue:", err)
    }
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="hover:bg-transparent">
            <BsThreeDots
              size={20}
              className={`transition-opacity duration-200 ${
                menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <HiOutlinePlus />
              Add to Playlist
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-64 max-h-96 overflow-y-auto">
                <div className="p-0.5 mb-0.5">
                  <div className="relative">
                    <HiOutlineMagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Find a playlist"
                      className="w-full pl-8 pr-3 py-2.5 rounded bg-neutral-800 text-sm outline-none placeholder:text-neutral-400 focus:bg-neutral-700"
                    />
                  </div>
                </div>
                <DropdownMenuItem
                  onClick={handleCreatePlaylist}
                  className="pr-24"
                >
                  <HiOutlinePlus />
                  New playlist
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {playlists?.length === 0 && (
                  <DropdownMenuItem disabled>
                    No playlists found
                  </DropdownMenuItem>
                )}
                <div className="">
                  {playlists
                    ?.filter((p) =>
                      p.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((playlist) => (
                      <DropdownMenuItem
                        key={playlist.id}
                        onClick={() => handleAddTrackToPlaylist(playlist.id)}
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {playlistId && (
            <DropdownMenuItem onClick={handleRemoveTrackFromPlaylist}>
              <HiOutlineTrash />
              Remove from this playlist
            </DropdownMenuItem>
          )}

          {queueId && (
            <DropdownMenuItem onClick={handleRemoveFromQueue}>
              <HiOutlineTrash />
              Remove from Queue
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleAddToQueue}>
            <HiOutlineQueueList />
            Add to Queue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Track already in playlist</AlertDialogTitle>
            <AlertDialogDescription>
              This track is already in the selected playlist. You cannot add it
              twice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
