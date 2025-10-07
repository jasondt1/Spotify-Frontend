"use client"

import React, { useEffect, useState } from "react"
import { usePlayer } from "@/contexts/player-context"
import { HistoryResponseDto } from "@/dto/history"
import { historyService } from "@/services/history-service"
import { queueService } from "@/services/queue-service"
import { AnimatePresence } from "framer-motion"

import { toast } from "@/hooks/use-toast"

import { HoverWrapper } from "./hover-wrapper"
import YourQueueTabs from "./your-queue-tabs"
import YourQueueTrackItem from "./your-queue-track-row"

export default function YourQueue() {
  const { queue, nowPlaying, localQueue, localQueueName, fetchQueue } =
    usePlayer()

  const [tab, setTab] = useState<"queue" | "history">("queue")
  const [historyItems, setHistoryItems] = useState<HistoryResponseDto[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      if (tab !== "history") return

      try {
        const history = await historyService.getMyHistory()
        const sliced = history.slice(1, 100)
        setHistoryItems(sliced)
      } catch (err) {
        console.error("Failed to fetch history", err)
      }
    }

    fetchHistory()
  }, [tab])

  const handleClearQueue = async () => {
    try {
      await queueService.clear()
      await fetchQueue()
      toast({ description: "Queue cleared." })
    } catch (err) {
      console.error("Failed to clear queue:", err)
    }
  }

  return (
    <HoverWrapper className="flex w-full flex-col gap-2 p-1.5">
      <div className="flex items-center justify-between my-4">
        <YourQueueTabs tab={tab} setTab={setTab} />
      </div>

      {tab === "queue" && (
        <>
          <h2 className="ml-3 font-semibold text-white">Now Playing</h2>
          {nowPlaying && (
            <YourQueueTrackItem
              track={nowPlaying.track}
              highlight
              noInitialAnimation
            />
          )}

          {queue.length > 0 && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="ml-3 mb-2 font-semibold text-white">
                  Next in queue
                </h2>
                <p
                  className="mr-3 cursor-pointer text-sm text-neutral-400 hover:text-white"
                  onClick={handleClearQueue}
                >
                  Clear Queue
                </p>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                {queue.map((item, index) => (
                  <YourQueueTrackItem
                    key={item.id}
                    track={item.track}
                    queueId={item.id}
                    queueIndex={index + 1}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {localQueue.length > 0 && (
            <div className="flex flex-col">
              <h2 className="ml-3 mb-2 font-semibold text-white">
                Next from {localQueueName}
              </h2>
              <AnimatePresence mode="popLayout" initial={false}>
                {localQueue.map((track) => (
                  <YourQueueTrackItem key={track.id} track={track} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {tab === "history" && (
        <div className="flex flex-col -mt-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {historyItems.map((item, idx) => (
              <YourQueueTrackItem key={idx} history={item} highlight />
            ))}
          </AnimatePresence>
        </div>
      )}
    </HoverWrapper>
  )
}
