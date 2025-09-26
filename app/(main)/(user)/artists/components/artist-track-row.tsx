"use client"

import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"
import type { TopTrackDto } from "@/dto/artist"
import { FaPlay } from "react-icons/fa"

import { formatDuration, formatNumber } from "@/lib/format"
import { EqualizerBars } from "@/components/equalizer-bars"
import { TrackDropdownMenu } from "@/components/track-dropdown-menu"

import { TrackLikedIndicator } from "../../../../../components/track-liked-indicator"

type Props = {
  track: TopTrackDto
  index: number
  artistId: string
}

export function ArtistTrackRow({ track, index, artistId }: Props) {
  const { setNowPlaying, nowPlaying, isPlaying } = usePlayer()

  const isCurrent =
    nowPlaying?.track?.id === track.track.id &&
    nowPlaying?.artistId === artistId

  return (
    <div className="group flex items-center gap-3 p-2 rounded-md hover:bg-white/10">
      <div className="w-[3%] min-w-[30px] text-lg font-medium text-center">
        {!isCurrent ? (
          <>
            <span className="group-hover:hidden">{index}</span>
            <button
              onClick={() => setNowPlaying(track.track.id, { artistId })}
              className="hidden group-hover:flex items-center justify-center w-full h-full"
            >
              <FaPlay size={10} />
            </button>
          </>
        ) : (
          <>
            {isPlaying ? (
              <EqualizerBars />
            ) : (
              <div>
                <span className="group-hover:hidden text-green-500">
                  {index}
                </span>
                <button
                  className="hidden group-hover:flex items-center justify-center w-full h-full"
                  onClick={() => setNowPlaying(track.track.id, { artistId })}
                >
                  <FaPlay size={10} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-[4%] min-w-[40px]">
        <img
          src={track.track.album?.image}
          alt={track.track.title}
          className="h-10 w-10 object-cover rounded-md"
        />
      </div>

      <div className="flex-1 font-medium text-[15px] truncate">
        <Link
          href={`/track/${track.track.id}`}
          className={`hover:underline cursor-pointer ${
            isCurrent ? "!text-green-500" : ""
          }`}
        >
          {track.track.title}
        </Link>
      </div>

      <div className="w-[20%] truncate text-sm font-medium text-gray-300 text-right">
        {formatNumber(track.playCount)}
      </div>

      <div className="w-[20%] flex justify-end">
        <TrackLikedIndicator track={track.track} />
      </div>

      <div className="w-[4%] text-right text-sm text-gray-300">
        {formatDuration(track.track.duration)}
      </div>

      <div className="w-[5%] flex justify-end">
        <TrackDropdownMenu track={track.track} />
      </div>
    </div>
  )
}
