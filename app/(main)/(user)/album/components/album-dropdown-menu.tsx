"use client"

import { useState } from "react"
import { usePlayer } from "@/contexts/player-context"
import { useUser } from "@/contexts/user-context"
import { AlbumResponseDto } from "@/dto/artist"
import { libraryService } from "@/services/library-service"
import { queueService } from "@/services/queue-service"
import { BsThreeDots } from "react-icons/bs"
import { GoPlusCircle } from "react-icons/go"
import { HiOutlineQueueList, HiOutlineTrash } from "react-icons/hi2"

import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const { fetchQueue } = usePlayer()
  const { libraries, fetchLibraries } = useUser()

  const isInLibrary = libraries.some(
    (lib) => lib.type === "album" && lib.id === album.id
  )

  const handleAddToQueue = async () => {
    try {
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
      toast({
        description: `Removed "${album.title}" from your library.`,
      })
      await fetchLibraries()
    } catch (err) {
      console.error("Failed to remove album from library:", err)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
