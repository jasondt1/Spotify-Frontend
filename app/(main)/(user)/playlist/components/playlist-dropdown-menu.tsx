"use client"

import { useState } from "react"
import { usePlayer } from "@/contexts/player-context"
import { PlaylistResponseDto } from "@/dto/playlist"
import { queueService } from "@/services/queue-service"
import { BsThreeDots } from "react-icons/bs"
import { HiOutlineQueueList } from "react-icons/hi2"

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
