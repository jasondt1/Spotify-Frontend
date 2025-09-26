"use client"

import React from "react"
import type { LyricsLine, TrackResponseDto } from "@/dto/artist"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function formatTs(sec: number | null) {
  if (sec === null || isNaN(sec)) return "--:--"
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
}

export default function ViewLyrics({ track }: { track: TrackResponseDto }) {
  const lyrics: LyricsLine[] | undefined = track.lyrics

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Lyrics
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Lyrics — {track.title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {!lyrics || lyrics.length === 0 ? (
            <p className="text-sm text-neutral-400">No lyrics available.</p>
          ) : (
            lyrics.map((line, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="text-xs text-neutral-500 w-12 text-right mt-0.5">
                  {formatTs(line.timestamp)}
                </span>
                <p className="text-sm whitespace-pre-wrap">{line.text}</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

