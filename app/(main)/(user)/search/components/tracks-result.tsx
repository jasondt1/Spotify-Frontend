"use client"

import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"
import type { TrackResponseDto } from "@/dto/artist"
import { FaPause, FaPlay } from "react-icons/fa"
import { IoIosPause, IoIosPlay } from "react-icons/io"

import { formatDuration } from "@/lib/format"
import { TrackDropdownMenu } from "@/components/track-dropdown-menu"
import { TrackLikedIndicator } from "@/components/track-liked-indicator"

import NoResult from "./no-result"

interface Props {
  tracks: TrackResponseDto[]
  limit?: number
  query: string
}

export function TracksResult({ tracks, limit = 4, query }: Props) {
  const displayTracks = tracks.slice(0, limit)
  if (!displayTracks.length) return <NoResult label="Songs" query={query} />

  const { nowPlaying, setNowPlaying, isPlaying, togglePlay } = usePlayer()

  return (
    <div>
      {displayTracks.map((track) => {
        const isCurrent = nowPlaying?.track?.id === track.id

        return (
          <div
            key={track.id}
            className={`group grid items-center gap-3 rounded-md px-2 py-1.5 pr-0 hover:bg-white/10 ${
              isCurrent ? "bg-white/20" : ""
            }
            grid-cols-[48px,1fr,auto,auto,auto] sm:grid-cols-[48px,1fr,auto,auto,auto]`}
          >
            <div className="relative w-12 sm:w-[48px] aspect-square overflow-hidden rounded-md ml-1 shrink-0">
              {track.album?.image ? (
                <img
                  src={track.album.image}
                  alt={track.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-800" />
              )}

              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                transition-opacity duration-200 rounded-md"
              >
                {isCurrent ? (
                  <button
                    onClick={togglePlay}
                    className="text-white outline-none focus:opacity-100"
                    aria-label={isPlaying ? "Pause" : "Play"}
                    tabIndex={0}
                  >
                    {!isPlaying ? (
                      <IoIosPlay size={24} />
                    ) : (
                      <IoIosPause size={24} />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setNowPlaying(track.id, {
                        artistId: track.artists?.[0]?.id,
                      })
                    }
                    className="text-white outline-none focus:opacity-100"
                    aria-label="Play"
                    tabIndex={0}
                  >
                    <FaPlay size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="min-w-0 -translate-y-0.5 ml-0.5">
              <Link
                href={`/track/${track.id}`}
                className={`truncate font-medium hover:underline cursor-pointer ${
                  isCurrent ? "text-green-500" : "text-white"
                }`}
                title={track.title}
              >
                {track.title}
              </Link>
              <div className="truncate text-xs font-medium text-neutral-400">
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

            <div className="flex justify-center">
              <TrackLikedIndicator track={track} />
            </div>

            <div className="hidden sm:block text-right text-sm text-neutral-400 translate-x-2">
              {formatDuration(track.duration)}
            </div>

            <div className="flex justify-end">
              <TrackDropdownMenu track={track} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
