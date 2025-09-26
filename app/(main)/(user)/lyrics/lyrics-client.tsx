"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { usePlayer } from "@/contexts/player-context"
import clsx from "clsx"

interface LyricsClientProps {
  color: { dark: string; mid: string; light: string }
}

export default function LyricsClient({ color }: LyricsClientProps) {
  const { nowPlaying, progress, seek, isPlaying } = usePlayer()
  const activeLineRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)
  const isProgrammaticScroll = useRef(false)
  const router = useRouter()
  const [autoSync, setAutoSync] = useState(true)

  const lyrics = nowPlaying?.track?.lyrics || []

  const activeIndex = lyrics.findIndex((line: any, i: number) => {
    const next = lyrics[i + 1]
    return progress >= line.timestamp && (!next || progress < next.timestamp)
  })

  const animateScrollTo = (el: HTMLElement, to: number, duration = 650) => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.scrollTop = to
      return
    }
    if (rafId.current) cancelAnimationFrame(rafId.current)
    const start = el.scrollTop
    const change = to - start
    const t0 = performance.now()
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    isProgrammaticScroll.current = true
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      el.scrollTop = start + change * easeInOutCubic(t)
      if (t < 1) {
        rafId.current = requestAnimationFrame(step)
      } else {
        requestAnimationFrame(() => {
          isProgrammaticScroll.current = false
        })
      }
    }
    rafId.current = requestAnimationFrame(step)
  }

  const handleSync = () => {
    const container = document.getElementById(
      "main-content"
    ) as HTMLElement | null
    const target = activeLineRef.current
    if (!container || !target) return
    const cRect = container.getBoundingClientRect()
    const tRect = target.getBoundingClientRect()
    const offsetWithin = tRect.top - cRect.top + container.scrollTop
    const to =
      offsetWithin - container.clientHeight / 2 + target.clientHeight / 2
    animateScrollTo(container, Math.max(0, to))
  }

  useEffect(() => {
    const container = document.getElementById("main-content")
    if (container && color?.dark)
      (container as HTMLElement).style.backgroundColor = color.dark
    return () => {
      if (container)
        (container as HTMLElement).style.backgroundColor = "#171717"
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [color?.dark])

  useEffect(() => {
    const container = document.getElementById("main-content")
    if (!container) return
    const onScroll = () => {
      if (isProgrammaticScroll.current) return
      setAutoSync(false)
    }
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!autoSync) return
    handleSync()
  }, [activeIndex, isPlaying, autoSync])

  useEffect(() => {
    const container = document.getElementById(
      "main-content"
    ) as HTMLElement | null
    if (container) {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      isProgrammaticScroll.current = true
      container.scrollTop = 0
      requestAnimationFrame(() => {
        isProgrammaticScroll.current = false
      })
    }
    setAutoSync(true)
  }, [nowPlaying?.track?.id])

  useEffect(() => {
    router.refresh()
    setAutoSync(true)
  }, [nowPlaying])

  const onClickSync = () => {
    setAutoSync(true)
    handleSync()
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center text-center relative">
        <div className="h-full w-full max-w-2xl p-6">
          {lyrics.length === 0 && (
            <div
              style={{ color: color.mid }}
              className={clsx(
                "my-8 text-5xl transition-colors font-bold leading-tight tracking-tight cursor-default"
              )}
            >
              No lyrics available
            </div>
          )}

          {lyrics.map((line: any, i: number) => {
            const isActive = i === activeIndex
            const isLast = i === lyrics.length - 1
            const isPast = i < activeIndex
            return (
              <div
                key={i}
                ref={isActive ? activeLineRef : null}
                onClick={() => {
                  seek(line.timestamp)
                  setAutoSync(true)
                  handleSync()
                }}
                style={{
                  color: isActive ? "white" : color.mid,
                  opacity: isPast ? 0.45 : 1,
                }}
                className={clsx(
                  "my-8 text-5xl transition-colors text-left font-bold leading-tight cursor-pointer tracking-tighter",
                  !isActive && "hover:underline",
                  isLast && "pb-14"
                )}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = color.light
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = color.mid
                }}
              >
                {line.text}
              </div>
            )
          })}
        </div>
      </div>

      {!autoSync && (
        <button
          onClick={onClickSync}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur border"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6))",
            color: "#fff",
            borderColor: "rgba(255,255,255,0.15)",
          }}
          aria-label="Sync to current line"
        >
          Sync to current line
        </button>
      )}
    </>
  )
}
