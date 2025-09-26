"use client"

import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"
import type { TrackResponseDto } from "@/dto/artist"
import { FaPlay } from "react-icons/fa"

import { formatDuration } from "@/lib/format"
import { EqualizerBars } from "@/components/equalizer-bars"
import { TrackDropdownMenu } from "@/components/track-dropdown-menu"
import { TrackLikedIndicator } from "@/components/track-liked-indicator"

type Props = {
  track: TrackResponseDto
  index: number
}

export function AlbumTrackRow({ track, index }: Props) {
  const { setNowPlaying, nowPlaying, isPlaying } = usePlayer()

  const isCurrent =
    nowPlaying?.track?.id === track.id &&
    nowPlaying?.albumId === track.album?.id

  return (
    <div className="group flex items-center gap-3 p-2 rounded-md hover:bg-white/10 pl-6">
      <div className="w-[3%] min-w-[30px] text-lg font-medium text-center">
        {!isCurrent && <span className="group-hover:hidden">{index}</span>}

        {!isCurrent ? (
          <button
            onClick={() =>
              setNowPlaying(track.id, { albumId: track.album?.id })
            }
            className="hidden group-hover:flex items-center justify-center w-full h-full"
          >
            <FaPlay size={10} />
          </button>
        ) : isPlaying ? (
          <EqualizerBars />
        ) : (
          <div>
            <span className="group-hover:hidden text-green-500">{index}</span>
            <button
              className="hidden group-hover:flex items-center justify-center w-full h-full"
              onClick={() =>
                setNowPlaying(track.id, { albumId: track.album?.id })
              }
            >
              <FaPlay size={10} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 font-medium text-[15px] truncate flex flex-col">
        <Link
          href={`/track/${track.id}`}
          className={`hover:underline cursor-pointer ${
            isCurrent ? "text-green-500" : ""
          }`}
        >
          {track.title}
        </Link>
        <span className="text-xs text-neutral-400">
          {track.artists?.map((a, idx) => (
            <Link
              key={a.id}
              href={`/artists/${a.id}`}
              className="hover:underline hover:text-white"
            >
              {a.name}
              {idx < track.artists!.length - 1 && ", "}
            </Link>
          ))}
        </span>
      </div>

      <div className="w-[5%] flex justify-center">
        <TrackLikedIndicator track={track} />
      </div>

      <div className="w-[8%] text-right text-sm text-gray-300">
        {formatDuration(track.duration)}
      </div>

      <div className="w-[5%] flex justify-end">
        <TrackDropdownMenu track={track} />
      </div>
    </div>
  )
}
