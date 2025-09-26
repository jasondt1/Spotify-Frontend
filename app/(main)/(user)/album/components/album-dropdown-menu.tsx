"use client"

import { useState } from "react"
import { usePlayer } from "@/contexts/player-context"
import { useUser } from "@/contexts/user-context"
import type { AlbumResponseDto } from "@/dto/artist"
import type { PlaylistResponseDto } from "@/dto/playlist"
import { libraryService } from "@/services/library-service"
import { playlistService } from "@/services/playlist-service"
import { queueService } from "@/services/queue-service"
import { BsThreeDots } from "react-icons/bs"
import { GoPlusCircle } from "react-icons/go"
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineQueueList,
  HiOutlineTrash,
} from "react-icons/hi2"

import { useToast } from "@/hooks/use-toast"
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

type AlbumDropdownMenuProps = {
  album: AlbumResponseDto
  enableAddToQueue: boolean
}

export function AlbumDropdownMenu({
  album,
  enableAddToQueue,
}: AlbumDropdownMenuProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { fetchQueue } = usePlayer()
  const { libraries, playlists, fetchLibraries, fetchPlaylists, currentUser } =
    useUser()

  const isInLibrary = libraries.some(
    (lib) => lib.type === "album" && lib.id === album.id
  )

  const handleAddToQueue = async () => {
    try {
      if (!currentUser) {
        toast({
          description: "Please log in to add album to the queue",
        })
        return
      }
      await queueService.addAlbum(album.id)
      toast({
        description: `Successfully added "${album.title}" to the queue.`,
      })
      await fetchQueue()
    } catch (err) {
      console.error("Failed to add album to queue:", err)
    }
  }

  const handleAddToLibrary = async () => {
    try {
      if (!currentUser) {
        toast({
          description: "Please log in to add album to your library",
        })
        return
      }
      await libraryService.addAlbum(album.id)
      toast({
        description: `Successfully added "${album.title}" to your library.`,
      })
      await fetchLibraries()
    } catch (err) {
      console.error("Failed to add album to library:", err)
    }
  }

  const handleRemoveFromLibrary = async () => {
    try {
      await libraryService.removeAlbum(album.id)
      toast({ description: `Removed "${album.title}" from your library.` })
      await fetchLibraries()
    } catch (err) {
      console.error("Failed to remove album from library:", err)
    }
  }

  const handleAddAlbumToPlaylist = async (playlistId: string) => {
    try {
      if (!currentUser) {
        toast({
          description: "Please log in to add album to playlists",
        })
        return
      }
      await playlistService.addAlbum(playlistId, album.id)
      toast({ description: `Added "${album.title}" to the playlist.` })
      setOpen(false)
    } catch (err) {
      console.error("Failed to add album to playlist:", err)
    }
  }

  const handleCreatePlaylistAndAddAlbum = async () => {
    try {
      if (!currentUser) {
        toast({
          description: "Please log in to create playlist",
        })
        return
      }
      const created = await playlistService.create({
        name: album.title,
        description: "",
        image: album.image || "",
        trackIds: [],
      })
      await playlistService.addAlbum(created.id, album.id)
      toast({ description: `Created playlist and added "${album.title}".` })
      await fetchPlaylists()
      await fetchLibraries()
      setOpen(false)
    } catch (err) {
      console.error("Failed to create playlist and add album:", err)
    }
  }

  const loadOnOpen = async (v: boolean) => {
    setOpen(v)
    if (v) {
      try {
        await fetchPlaylists()
      } catch (err) {
        console.error("Failed to fetch playlists:", err)
      }
    }
  }

  const filteredPlaylists: PlaylistResponseDto[] =
    playlists?.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ) || []

  return (
    <DropdownMenu open={open} onOpenChange={loadOnOpen}>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-300 hover:text-white hover:scale-110 transition-transform">
          <BsThreeDots size={30} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="start">
        {enableAddToQueue && (
          <DropdownMenuItem onClick={handleAddToQueue}>
            <HiOutlineQueueList />
            Add to Queue
          </DropdownMenuItem>
        )}

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
                onClick={handleCreatePlaylistAndAddAlbum}
                className="pr-24"
              >
                <HiOutlinePlus />
                New playlist
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {filteredPlaylists.length === 0 ? (
                <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>
              ) : (
                filteredPlaylists.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => handleAddAlbumToPlaylist(p.id)}
                    className="truncate"
                    title={p.name}
                  >
                    {p.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {isInLibrary ? (
          <DropdownMenuItem onClick={handleRemoveFromLibrary}>
            <HiOutlineTrash />
            Remove from Library
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleAddToLibrary}>
            <GoPlusCircle />
            Add to Library
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
