"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type {
  ArtistResponseDto,
  LyricsLine,
  TrackResponseDto,
} from "@/dto/artist"
import { lyricService } from "@/services/lyric-service"
import { uploadAudio } from "@/services/storage-service"
import { trackService } from "@/services/track-service"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UpdateTrackProps {
  track: TrackResponseDto
  albumId: string
  onUpdated?: () => void
  currentArtistId?: string
  currentArtistName?: string
  artists?: ArtistResponseDto[]
}

export default function UpdateTrack({
  track,
  albumId,
  onUpdated,
  currentArtistId,
  currentArtistName,
  artists: artistsProp,
}: UpdateTrackProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(track.title)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number>(track.duration)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingUseId, setLoadingUseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [artists, setArtists] = useState<ArtistResponseDto[]>(artistsProp || [])
  const [selectedArtistId, setSelectedArtistId] = useState<string>("")
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([])
  const [regenerateLyrics, setRegenerateLyrics] = useState(false)
  const [audioUrlOverride, setAudioUrlOverride] = useState<string | null>(null)
  const [ytLoading, setYtLoading] = useState(false)
  const [ytResults, setYtResults] = useState<
    {
      id: string
      title: string
      channelTitle: string
      durationText: string
      thumbnail: string
    }[]
  >([])
  const router = useRouter()

  useEffect(() => {
    if (artistsProp && artistsProp.length > 0) {
      const filtered = artistsProp.filter((a) => a.id !== currentArtistId)
      setArtists(filtered)
    }
  }, [artistsProp, currentArtistId])

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setYtLoading(true)
        setError(null)
        const q = `${currentArtistName || ""} ${title}`.trim()
        if (!q) {
          setYtResults([])
          return
        }
        const res = await fetch(
          `/api/youtube/search?q=${encodeURIComponent(q)}`
        )
        const data = await res.json()
        setYtResults(data.items || [])
      } catch (err: any) {
        setError(err?.message || "YouTube search failed")
      } finally {
        setYtLoading(false)
      }
    }
    if (open) fetchSuggestions()
  }, [open, currentArtistName, title])

  useEffect(() => {
    if (track?.artists && track.artists.length > 0) {
      const ids = track.artists
        .map((a) => a.id)
        .filter((id) => (currentArtistId ? id !== currentArtistId : true))
      setSelectedArtistIds(ids)
    }
  }, [track, currentArtistId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError("Title is required")
    if (!duration || Number(duration) <= 0)
      return setError("Duration must be > 0 (seconds)")
    setLoadingSubmit(true)
    setError(null)
    try {
      let audioUrl: string | undefined
      let lyrics: LyricsLine[] = track.lyrics || []

      if (audioUrlOverride) {
        audioUrl = audioUrlOverride
      } else if (audioFile) {
        audioUrl = await uploadAudio(audioFile, `albums/${albumId}/`)
      }

      if (regenerateLyrics) {
        if (audioFile) {
          lyrics = await lyricService.getLyrics(
            audioFile,
            currentArtistName || "Unknown",
            title
          )
        } else {
          const target = audioUrl || track.audio
          const blob = await fetch(target as string).then((r) => r.blob())
          const file = new File([blob], "audio.mp3", {
            type: blob.type || "audio/mpeg",
          })
          lyrics = await lyricService.getLyrics(
            file,
            currentArtistName || "Unknown",
            title
          )
        }
      }

      await trackService.update(track.id, {
        title: title.trim(),
        audio: audioUrl ?? track.audio,
        duration: Math.round(Number(duration)),
        albumId,
        artistIds: selectedArtistIds,
        lyrics,
      })
      setOpen(false)
      setAudioFile(null)
      setAudioUrlOverride(null)
      if (fileRef.current) fileRef.current.value = ""
      onUpdated?.()
      router.refresh()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update track"
      setError(msg)
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>Update track details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label htmlFor="track-title">Title</Label>
              <Input
                id="track-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label>Other Artists (optional)</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedArtistId}
                  onValueChange={setSelectedArtistId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select artist" />
                  </SelectTrigger>
                  <SelectContent>
                    {artists.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => {
                    if (
                      selectedArtistId &&
                      !selectedArtistIds.includes(selectedArtistId)
                    ) {
                      setSelectedArtistIds((prev) => [
                        ...prev,
                        selectedArtistId,
                      ])
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              {selectedArtistIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedArtistIds.map((id) => {
                    const a = artists.find((x) => x.id === id)
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-800 pl-4 pr-2 py-1 text-sm"
                      >
                        {a?.name || id}
                        <Button
                          type="button"
                          variant="ghost"
                          className="rounded-full w-8 h-8"
                          onClick={() =>
                            setSelectedArtistIds((prev) =>
                              prev.filter((x) => x !== id)
                            )
                          }
                        >
                          ×
                        </Button>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label>YouTube Suggestions</Label>
              </div>
              {!ytLoading && ytResults.length > 0 && (
                <div className="mt-2 max-h-56 overflow-auto rounded border border-neutral-800">
                  {ytResults.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-3 p-2 hover:bg-neutral-900"
                    >
                      {v.thumbnail && (
                        <img
                          src={v.thumbnail}
                          alt="thumb"
                          className="w-16 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium line-clamp-1">
                          {v.title}
                        </div>
                        <div className="text-xs text-neutral-400 line-clamp-1">
                          {v.channelTitle} • {v.durationText}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!!loadingUseId}
                        onClick={async () => {
                          try {
                            setLoadingUseId(v.id)
                            setError(null)
                            const res = await fetch(`/api/youtube/download`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ videoId: v.id, albumId }),
                            })
                            if (!res.ok) throw new Error(await res.text())
                            const data = await res.json()
                            const url = data.publicUrl as string
                            setAudioUrlOverride(url)
                            const audio = new Audio()
                            audio.src = url
                            audio.addEventListener("loadedmetadata", () => {
                              setDuration(
                                isFinite(audio.duration)
                                  ? Math.round(audio.duration)
                                  : track.duration
                              )
                            })
                          } catch (err: any) {
                            setError(err?.message || "Download failed")
                          } finally {
                            setLoadingUseId(null)
                          }
                        }}
                      >
                        {loadingUseId === v.id ? (
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                        ) : (
                          "Use"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="track-audio">Replace Audio (optional)</Label>
              {audioUrlOverride ? (
                <div className="flex items-center justify-between rounded border border-neutral-800 px-3 py-2">
                  <span className="text-sm text-neutral-300">
                    Using YouTube audio
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setAudioUrlOverride(null)
                      setAudioFile(null)
                      if (fileRef.current) fileRef.current.value = ""
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Input
                  id="track-audio"
                  type="file"
                  accept="audio/*"
                  ref={fileRef}
                  onChange={async (e) => {
                    setError(null)
                    const file = e.target.files?.[0]
                    if (!file) {
                      setAudioFile(null)
                      setDuration(track.duration)
                      return
                    }
                    setAudioFile(file)
                    const objectUrl = URL.createObjectURL(file)
                    const audio = new Audio()
                    audio.src = objectUrl
                    audio.addEventListener("loadedmetadata", () => {
                      setDuration(
                        isFinite(audio.duration)
                          ? Math.round(audio.duration)
                          : track.duration
                      )
                      URL.revokeObjectURL(objectUrl)
                    })
                    audio.addEventListener("error", () => {
                      setError("Failed to load audio file")
                      URL.revokeObjectURL(objectUrl)
                    })
                  }}
                />
              )}
              {!!duration && (
                <p className="text-sm text-neutral-400">
                  Current duration: {Math.floor(duration / 60)}:
                  {String(duration % 60).padStart(2, "0")}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="regenerate-lyrics"
                type="checkbox"
                checked={regenerateLyrics}
                onChange={(e) => setRegenerateLyrics(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="regenerate-lyrics" className="text-sm">
                Regenerate lyrics
              </Label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  Updating...
                </span>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
