"use client"

import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"
import type { TrackResponseDto } from "@/dto/artist"
import { FaPlay, FaRegClock } from "react-icons/fa"
import { IoIosPause, IoIosPlay } from "react-icons/io"

import { formatDuration } from "@/lib/format"
import { EqualizerBars } from "@/components/equalizer-bars"
import { TrackDropdownMenu } from "@/components/track-dropdown-menu"
import { TrackLikedIndicator } from "@/components/track-liked-indicator"

interface Props {
  tracks: TrackResponseDto[]
}

export function FullTracksResult({ tracks }: Props) {
  if (!tracks.length) return null

  const { nowPlaying, setNowPlaying, isPlaying, togglePlay } = usePlayer()

  return (
    <div>
      <div className="flex items-center gap-3 p-2 pl-6 border-b border-white/10 text-sm font-medium text-gray-400">
        <div className="w-[3%] min-w-[30px] text-left">#</div>
        <div className="flex-1">Title</div>
        <div className="w-[40%]">Album</div>
        <div className="w-[5%] text-center"></div>
        <div className="w-[8%] flex justify-end items-center">
          <FaRegClock size={14} />
        </div>
        <div className="w-[5%]"></div>
      </div>
      <div>
        {tracks.map((track, index) => {
          const isCurrent = nowPlaying?.track?.id === track.id
          return (
            <div
              key={track.id}
              className="group flex items-center gap-3 px-3 py-2 pr-0 rounded-md hover:bg-white/10"
            >
              <div className="w-[3%] min-w-[30px] text-center relative">
                {!isCurrent ? (
                  <div className="relative">
                    <span className="group-hover:opacity-0 transition">
                      {index + 1}
                    </span>
                    <button
                      className="absolute inset-0 hidden group-hover:flex items-center justify-center text-white"
                      onClick={() =>
                        setNowPlaying(track.id, {
                          artistId: track.artists?.[0]?.id,
                        })
                      }
                    >
                      <FaPlay size={14} />
                    </button>
                  </div>
                ) : isPlaying ? (
                  <EqualizerBars />
                ) : (
                  <div className="relative">
                    <span className="text-green-500 group-hover:opacity-0 transition">
                      {index + 1}
                    </span>
                    <button
                      className="absolute inset-0 hidden group-hover:flex items-center justify-center text-white"
                      onClick={togglePlay}
                    >
                      <FaPlay size={10} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-3">
                {track.album?.image ? (
                  <img
                    src={track.album.image}
                    alt={track.title}
                    className="h-11 w-11 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-md bg-neutral-800" />
                )}
                <div className="min-w-0">
                  <p
                    className={`font-medium truncate hover:underline cursor-pointer ${
                      isCurrent ? "text-green-500" : "text-white"
                    }`}
                    title={track.title}
                  >
                    {track.title}
                  </p>
                  <div className="text-xs text-neutral-400 truncate font-medium">
                    {(track.artists ?? []).map((artist, i, arr) => (
                      <span key={artist.id}>
                        <Link
                          href={`/artists/${artist.id}`}
                          className="hover:underline hover:text-white"
                        >
                          {artist.name}
                        </Link>
                        {i < arr.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-[40%] truncate text-sm text-neutral-400">
                {track.album && (
                  <Link
                    href={`/album/${track.album.id}`}
                    className="hover:underline cursor-pointer"
                  >
                    {track.album.title}
                  </Link>
                )}
              </div>
              <div className="w-[5%] flex justify-center">
                <TrackLikedIndicator track={track} />
              </div>
              <div className="w-[8%] text-right text-sm text-neutral-400">
                {formatDuration(track.duration)}
              </div>
              <div className="w-[5%] flex justify-end">
                <TrackDropdownMenu track={track} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
