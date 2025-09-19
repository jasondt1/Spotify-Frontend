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
            className={`group flex items-center gap-3 px-3 py-2 pr-0 rounded-md hover:bg-white/10 ${
              isCurrent ? "bg-white/20" : ""
            }`}
          >
            <div className="w-[9%] min-w-[40px] relative group">
              {track.album?.image ? (
                <img
                  src={track.album.image}
                  alt={track.title}
                  className="h-11 w-11 object-cover rounded-md ml-1"
                />
              ) : (
                <div className="h-11 w-11 rounded-md bg-neutral-800 ml-1" />
              )}

              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100
                  transition-opacity duration-200 rounded-md"
              >
                {isCurrent ? (
                  <button
                    onClick={togglePlay}
                    className="text-white transition"
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
                    className="text-white transition"
                  >
                    <FaPlay size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 -ml-1">
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

            <div className="w-[5%] flex justify-center">
              <TrackLikedIndicator track={track} />
            </div>

            <div className="w-[8%] text-right text-sm text-neutral-400">
              {formatDuration(track.duration)}
            </div>

            <div className="w-[7%] flex justify-end">
              <TrackDropdownMenu track={track} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
