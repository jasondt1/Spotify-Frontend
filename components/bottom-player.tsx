"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePlayer } from "@/contexts/player-context"
import {
  IoIosPause,
  IoIosPlay,
  IoMdSkipBackward,
  IoMdSkipForward,
} from "react-icons/io"
import {
  MdFullscreen,
  MdFullscreenExit,
  MdLoop,
  MdOutlineVolumeDown,
  MdOutlineVolumeMute,
  MdOutlineVolumeOff,
  MdOutlineVolumeUp,
} from "react-icons/md"
import { TiArrowShuffle } from "react-icons/ti"

import { formatDuration } from "@/lib/format"

import { TrackLikedIndicator } from "./track-liked-indicator"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export default function BottomPlayer() {
  const {
    nowPlaying,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    progress,
    seek,
    shuffle,
    toggleShuffleForCurrent,
    repeat,
    setRepeat,
    volume,
    setVolume,
    isMuted,
    setMuted,
  } = usePlayer()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [localProgress, setLocalProgress] = useState(0)

  useEffect(() => {
    if (nowPlaying?.track?.id !== currentTrackId) {
      setCurrentTrackId(nowPlaying?.track?.id || null)
      setLocalProgress(0)
    } else {
      setLocalProgress(progress)
    }
  }, [nowPlaying?.track?.id, progress, currentTrackId])

  if (!nowPlaying) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black text-white flex items-center justify-center">
        <span className="text-sm text-neutral-400">Nothing is playing</span>
      </div>
    )
  }

  const track = nowPlaying.track
  const duration = track.duration || 1

  const safeProgress = Math.min(localProgress, duration)
  const percent = Math.min((safeProgress / duration) * 100, 100)

  const handleToggleMute = () => {
    setMuted(!isMuted)
  }

  const renderVolumeIcon = () => {
    if (isMuted) return <MdOutlineVolumeOff size={20} />
    if (volume === 0) return <MdOutlineVolumeMute size={20} />
    if (volume < 0.5) return <MdOutlineVolumeDown size={20} />
    return <MdOutlineVolumeUp size={20} />
  }

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Failed to enter fullscreen", err))
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Failed to exit fullscreen", err))
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = duration * ratio
    seek(seekTime)
    setLocalProgress(seekTime)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={
            track.album?.image ??
            "https://via.placeholder.com/56x56.png?text=🎵"
          }
          alt={track.title}
          className="w-14 h-14 object-cover rounded"
        />
        <div className="flex flex-col overflow-hidden mr-4">
          <span className="font-medium text-sm truncate">{track.title}</span>
          <span className="text-xs text-neutral-400 font-medium truncate">
            {track.artists
              ?.map((a) => (
                <Link
                  key={a.id}
                  href={`/artists/${a.id}`}
                  className="hover:underline hover:text-white"
                >
                  {a.name}
                </Link>
              ))
              .reduce<React.ReactNode[]>((prev, curr, idx) => {
                if (idx > 0) prev.push(", ")
                prev.push(curr)
                return prev
              }, [])}
          </span>
        </div>
        <TrackLikedIndicator track={track} isPlayer />
      </div>

      <div className="flex flex-col items-center w-2/4">
        <div className="flex items-center gap-6 mb-2">
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <button
                onClick={toggleShuffleForCurrent}
                className={
                  shuffle
                    ? "text-green-500"
                    : "text-neutral-400 hover:text-white"
                }
              >
                <TiArrowShuffle size={22} />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              <p>{shuffle ? "Disable Shuffle" : "Enable Shuffle"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <button
                className="text-neutral-400 hover:text-white"
                onClick={previousTrack}
              >
                <IoMdSkipBackward size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              <p>Previous</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <button
                onClick={togglePlay}
                className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <IoIosPause size={22} />
                ) : (
                  <IoIosPlay size={22} className="translate-x-[1px]" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              <p>{isPlaying ? "Pause" : "Play"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <button
                className="text-neutral-400 hover:text-white"
                onClick={nextTrack}
              >
                <IoMdSkipForward size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              <p>Next</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setRepeat(!repeat)}
                className={
                  repeat
                    ? "text-green-500"
                    : "text-neutral-400 hover:text-white"
                }
              >
                <MdLoop size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>
              <p>{repeat ? "Disable Repeat" : "Enable Repeat"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2 w-full max-w-lg">
          <span className="text-[13px] font-medium text-neutral-400">
            {formatDuration(Math.floor(safeProgress))}
          </span>
          <div
            className="relative flex-1 h-1 bg-neutral-600 rounded cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="absolute left-0 top-0 h-1 bg-white rounded transition-all duration-100 linear"
              style={{
                width: `${percent}%`,
                maxWidth: "100%",
              }}
            />
          </div>
          <span className="text-[13px] font-medium text-neutral-400">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 w-1/4">
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <button
              onClick={handleToggleMute}
              className="text-neutral-400 hover:text-white"
            >
              {renderVolumeIcon()}
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            <p>{isMuted ? "Unmute" : "Mute"}</p>
          </TooltipContent>
        </Tooltip>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ ["--range-progress" as any]: `${volume * 100}%` }}
          className="max-w-24"
        />

        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>
            <button
              onClick={handleToggleFullscreen}
              className="text-neutral-400 hover:text-white"
            >
              {isFullscreen ? (
                <MdFullscreenExit size={20} />
              ) : (
                <MdFullscreen size={20} />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>
            <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
