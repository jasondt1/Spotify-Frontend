"use client"

import { useMemo } from "react"
import { usePlayer } from "@/contexts/player-context"
import { useUser } from "@/contexts/user-context"
import { FaRandom } from "react-icons/fa"
import { TiArrowShuffle } from "react-icons/ti"

import { toast } from "@/hooks/use-toast"

type Props = {
  sourceId?: string
}

export default function ShuffleToggle({ sourceId }: Props) {
  const { isShuffledFor, setShuffleFor } = usePlayer()
  const { currentUser } = useUser()

  const enabled = useMemo(
    () => isShuffledFor(sourceId),
    [isShuffledFor, sourceId]
  )

  return (
    <button
      className={
        enabled
          ? "text-green-500 hover:scale-110 transition-transform"
          : "text-neutral-400 hover:text-white hover:scale-110 transition-transform"
      }
      onClick={() => {
        if (!currentUser) {
          toast({
            description: "Please log in to shuffle",
          })
          return
        }
        if (!sourceId) return
        setShuffleFor(sourceId, !enabled)
      }}
      aria-pressed={enabled}
      title={enabled ? "Shuffle on" : "Shuffle off"}
    >
      <TiArrowShuffle size={32} />
    </button>
  )
}
