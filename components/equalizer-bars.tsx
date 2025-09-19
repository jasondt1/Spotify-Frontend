"use client"

import { usePlayer } from "@/contexts/player-context"
import { IoIosPause } from "react-icons/io"

export function EqualizerBars() {
  const { togglePlay } = usePlayer()

  return (
    <div className="relative flex items-center justify-center h-4 w-4 ml-1.5">
      <div className="flex items-end justify-center gap-[2px] h-4 group-hover:hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-[2px] bg-green-500 rounded-md animate-equalizer"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <button
        onClick={togglePlay}
        className="hidden group-hover:flex items-center justify-center text-white"
      >
        <IoIosPause size={16} />
      </button>
    </div>
  )
}
