"use client"

import { useUser } from "@/contexts/user-context"
import type { TrackResponseDto } from "@/dto/artist"
import { likedService } from "@/services/liked-service"
import { GoPlusCircle } from "react-icons/go"
import { IoIosCheckmarkCircle } from "react-icons/io"

import { useToast } from "@/hooks/use-toast"

import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type Props = {
  track: TrackResponseDto
  isPlayer?: boolean
}

export function TrackLikedIndicator({ track, isPlayer }: Props) {
  const { likedTracks, fetchLikedTracks } = useUser()
  const { toast } = useToast()

  const exists = likedTracks.some((t) => t.id === track.id)

  const handleLike = async () => {
    try {
      await likedService.like(track.id)
      await fetchLikedTracks()
      toast({
        description: `Added "${track.title}" to your liked songs.`,
      })
    } catch (err) {
      console.error("Failed to like track", err)
    }
  }

  const handleUnlike = async () => {
    try {
      await likedService.unlike(track.id)
      await fetchLikedTracks()
      toast({
        description: `Removed "${track.title}" from your liked songs.`,
      })
    } catch (err) {
      console.error("Failed to unlike track", err)
    }
  }

  if (!exists) {
    return (
      <div className="flex justify-center">
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 group"
              onClick={handleLike}
            >
              <GoPlusCircle
                size={28}
                className="!w-[1.15rem] !h-[1.15rem] opacity-0 group-hover:opacity-100"
                style={isPlayer ? { opacity: "100" } : {}}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={0}
            className="-mb-1 px-2 py-1 text-sm"
          >
            <p>Add to Liked Songs</p>
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0"
            onClick={handleUnlike}
          >
            <IoIosCheckmarkCircle
              size={28}
              className="!w-[1.15rem] !h-[1.15rem] text-green-500"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={0}
          className="-mb-1 px-2 py-1 text-sm"
        >
          <p>Remove from Liked Songs</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
