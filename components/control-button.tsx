"use client"

import React from "react"
import { usePlayer } from "@/contexts/player-context"
import { IoIosPause, IoIosPlay } from "react-icons/io"

interface ControlButtonProps {
  artistId?: string
  albumId?: string
  playlistId?: string
  firstTrackId?: string
  trackId?: string
}

export default function ControlButton({
  artistId,
  albumId,
  playlistId,
  firstTrackId,
  trackId,
}: ControlButtonProps) {
  const { isPlaying, togglePlay, nowPlaying, setNowPlaying } = usePlayer()

  const isCurrent =
    nowPlaying?.playlistId === playlistId ||
    nowPlaying?.albumId === albumId ||
    nowPlaying?.artistId === artistId

  if ((isCurrent || trackId) && !isPlaying) {
    return (
      <button
        onClick={togglePlay}
        className="bg-green-500 hover:scale-105 transition-transform text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        <IoIosPlay size={34} className="translate-x-0.5" />
      </button>
    )
  }

  if ((isCurrent || trackId) && isPlaying) {
    return (
      <button
        onClick={togglePlay}
        className="bg-green-500 hover:scale-105 transition-transform text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
      >
        <IoIosPause size={34} />
      </button>
    )
  }

  return (
    <button
      onClick={() => {
        if (firstTrackId) {
          setNowPlaying(firstTrackId, {
            artistId,
            albumId,
            playlistId,
          })
        }
        if (trackId) {
          setNowPlaying(trackId, {
            artistId,
            albumId,
            playlistId,
          })
        }
      }}
      className="bg-green-500 hover:scale-105 transition-transform text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
    >
      <IoIosPlay size={34} className="translate-x-0.5" />
    </button>
  )
}
