"use client"

import { useState } from "react"
import { usePlayer } from "@/contexts/player-context"
import { useUser } from "@/contexts/user-context"
import { PlaylistResponseDto } from "@/dto/playlist"
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
import { DeletePlaylist } from "@/app/(main)/(user)/playlist/components/delete-playlist"
import { EditPlaylist } from "@/app/(main)/(user)/playlist/components/edit-playlist"

type PlaylistDropdownMenuProps = {
  playlist: PlaylistResponseDto
  enableAddToQueue: boolean
}

export function PlaylistDropdownMenu({
  playlist,
  enableAddToQueue,
}: PlaylistDropdownMenuProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const { fetchQueue } = usePlayer()
  const { currentUser, libraries } = useUser()

  const handleAddToQueue = async () => {
    try {
      await queueService.addPlaylist(playlist.id)
      toast({
        description: `Successfully added "${playlist.name}" to the queue.`,
      })
      await fetchQueue()
    } catch (err) {
      console.error("Failed to add playlist to queue:", err)
    }
  }

  const handleAddToLibrary = async () => {
    try {
      await libraryService.addPlaylist(playlist.id)
      toast({
        description: `Successfully added "${playlist.name}" to your library.`,
      })
    } catch (err) {
      console.error("Failed to add playlist to library:", err)
    }
  }

  const handleRemoveFromLibrary = async () => {
    try {
      await libraryService.removePlaylist(playlist.id)
      toast({
        description: `Successfully removed "${playlist.name}" from your library.`,
      })
    } catch (err) {
      console.error("Failed to remove playlist from library:", err)
    }
  }

  const inLibrary = libraries.some((l) => l.id === playlist.id)
  const enableAddToLibrary =
    !!currentUser && playlist.ownerId !== currentUser.userId

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-300 hover:text-white hover:scale-110 transition-transform">
          <BsThreeDots size={30} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="start">
        {enableAddToLibrary &&
          (!inLibrary ? (
            <DropdownMenuItem onClick={handleAddToLibrary}>
              <GoPlusCircle />
              Add to Library
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleRemoveFromLibrary}>
              <HiOutlineTrash />
              Remove from Library
            </DropdownMenuItem>
          ))}

        {enableAddToQueue && (
          <DropdownMenuItem onClick={handleAddToQueue}>
            <HiOutlineQueueList />
            Add to Queue
          </DropdownMenuItem>
        )}

        <EditPlaylist
          playlist={playlist}
          closeDropdown={() => setOpen(false)}
        />
        <DeletePlaylist
          playlist={playlist}
          closeDropdown={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
