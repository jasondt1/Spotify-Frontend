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
  isTrackDetailPage?: boolean
}

export function TrackLikedIndicator({
  track,
  isPlayer,
  isTrackDetailPage,
}: Props) {
  const { likedTracks, fetchLikedTracks } = useUser()
  const { toast } = useToast()
  const { currentUser } = useUser()

  const exists = likedTracks.some((t) => t.id === track.id)

  const handleLike = async () => {
    try {
      if (!currentUser) {
        toast({
          description: "Please log in to like tracks",
        })
        return
      }
      await likedService.like(track.id)
      await fetchLikedTracks()
      toast({ description: `Added "${track.title}" to your liked songs.` })
    } catch (err) {
      console.error("Failed to like track", err)
    }
  }

  const handleUnlike = async () => {
    try {
      await likedService.unlike(track.id)
      await fetchLikedTracks()
      toast({ description: `Removed "${track.title}" from your liked songs.` })
    } catch (err) {
      console.error("Failed to unlike track", err)
    }
  }

  const iconBaseSize = isTrackDetailPage ? 32 : 0
  const iconSizeClass = isTrackDetailPage ? "" : "!w-[1.15rem] !h-[1.15rem]"
  const iconVisibility =
    isPlayer || isTrackDetailPage
      ? "opacity-100"
      : "opacity-0 group-hover:opacity-100"

  const detailBtnClasses =
    "group inline-flex items-center justify-center rounded-full p-0 hover:bg-transparent transition-transform duration-200 ease-out hover:scale-110"
  const normalBtnSizeClasses = "w-8 h-8"

  const renderBareButton = (liked: boolean) =>
    liked ? (
      <button
        type="button"
        aria-label="Remove from Liked Songs"
        onClick={handleUnlike}
        className={detailBtnClasses}
      >
        <IoIosCheckmarkCircle
          size={iconBaseSize || undefined}
          className={`${iconSizeClass} text-green-500`}
        />
      </button>
    ) : (
      <button
        type="button"
        aria-label="Add to Liked Songs"
        onClick={handleLike}
        className={detailBtnClasses}
      >
        <GoPlusCircle
          size={iconBaseSize || undefined}
          className={`${iconSizeClass} ${iconVisibility}`}
        />
      </button>
    )

  const renderWithTooltip = (liked: boolean) => (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        {liked ? (
          <Button
            variant="ghost"
            className={`hover:bg-transparent p-0 ${normalBtnSizeClasses}`}
            onClick={handleUnlike}
          >
            <IoIosCheckmarkCircle
              className={`${iconSizeClass} text-green-500`}
            />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className={`hover:bg-transparent p-0 group ${normalBtnSizeClasses}`}
            onClick={handleLike}
          >
            <GoPlusCircle className={`${iconSizeClass} ${iconVisibility}`} />
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={0}
        className="-mb-1 px-2 py-1 text-sm"
      >
        <p>{liked ? "Remove from Liked Songs" : "Add to Liked Songs"}</p>
      </TooltipContent>
    </Tooltip>
  )

  return (
    <div className="flex justify-center">
      {isTrackDetailPage ? renderBareButton(exists) : renderWithTooltip(exists)}
    </div>
  )
}
