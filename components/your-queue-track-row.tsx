import React, { forwardRef } from "react"
import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"
import { TrackResponseDto } from "@/dto/artist"
import { HistoryResponseDto } from "@/dto/history"
import { queueService } from "@/services/queue-service"
import { motion } from "framer-motion"
import { IoIosPause, IoIosPlay } from "react-icons/io"

import { TrackDropdownMenu } from "./track-dropdown-menu"

type TrackItemProps = {
  track?: TrackResponseDto
  history?: HistoryResponseDto
  queueId?: string
  queueIndex?: number
  highlight?: boolean
  noInitialAnimation?: boolean
}

function YourQueueTrackItemBase(
  {
    track,
    history,
    queueId,
    queueIndex,
    highlight,
    noInitialAnimation,
  }: TrackItemProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    togglePlay,
    isPlaying,
    nowPlaying,
    setNowPlaying,
    clearQueue,
    fetchQueue,
  } = usePlayer()

  const isHistory = !!history
  const trackObj: TrackResponseDto = track ?? {
    id: history!.trackId,
    title: history!.title,
    duration: history!.duration,
    audio: history!.audio,
    artists: history!.artists,
    album: history!.album,
    createdAt: history!.createdAt,
    updatedAt: history!.updatedAt,
  }

  const isCurrent = nowPlaying?.track?.id === trackObj.id

  const handlePlayClick = async () => {
    if (isCurrent && highlight) {
      togglePlay()
    } else {
      if (isHistory) {
        await setNowPlaying(trackObj.id, {})
        clearQueue()
      } else {
        await setNowPlaying(trackObj.id, {
          artistId: nowPlaying?.artistId,
          albumId: nowPlaying?.albumId,
          playlistId: nowPlaying?.playlistId,
        })
      }
    }

    if (queueId && queueIndex !== undefined) {
      await queueService.skip(queueIndex)
      fetchQueue()
    }
  }

  const enableHighlight = highlight && isCurrent

  return (
    <motion.div
      ref={ref}
      layout
      initial={noInitialAnimation ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.12 }}
      className="group flex items-center gap-3.5 px-3 py-1.5 pr-0 rounded-md hover:bg-white/10"
    >
      <div className="min-w-[40px] relative group">
        {trackObj.album?.image ? (
          <img
            src={trackObj.album.image}
            alt={trackObj.title}
            className="h-12 w-12 object-cover rounded-md"
          />
        ) : (
          <div className="h-12 w-12 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400">
            <IoIosPlay size={24} />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md bg-black/40">
          <button onClick={handlePlayClick} className="text-white transition">
            {isCurrent && isPlaying && highlight ? (
              <IoIosPause size={24} />
            ) : (
              <IoIosPlay size={24} />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0 mb-0.5">
        <Link
          href={`/track/${trackObj.id}`}
          className={`font-medium truncate hover:underline cursor-pointer ${
            enableHighlight ? "text-green-500" : "text-white"
          }`}
          title={trackObj.title}
        >
          {trackObj.title}
        </Link>
        <div className="text-sm text-neutral-400 truncate font-medium">
          {(trackObj.artists ?? []).map(
            (artist: any, i: number, arr: any[]) => (
              <span key={artist.id}>
                <Link
                  href={`/artists/${artist.id}`}
                  className="hover:underline hover:text-white"
                >
                  {artist.name}
                </Link>
                {i < arr.length - 1 ? ", " : ""}
              </span>
            )
          )}
        </div>
      </div>

      <div className="w-[7%] flex justify-end">
        <TrackDropdownMenu track={trackObj} queueId={queueId} />
      </div>
    </motion.div>
  )
}

const YourQueueTrackItem = forwardRef<HTMLDivElement, TrackItemProps>(
  YourQueueTrackItemBase
)

export default YourQueueTrackItem
