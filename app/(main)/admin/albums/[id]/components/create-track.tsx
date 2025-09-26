"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { ArtistResponseDto } from "@/dto/artist"
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

interface CreateTrackProps {
  albumId: string
  onCreated?: () => void
  currentArtistId?: string
  currentArtistName?: string
  artists?: ArtistResponseDto[]
}

export default function CreateTrack({
  albumId,
  onCreated,
  currentArtistId,
  currentArtistName,
  artists: artistsProp,
}: CreateTrackProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingUseId, setLoadingUseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [artists, setArtists] = useState<ArtistResponseDto[]>(artistsProp || [])
  const [selectedArtistId, setSelectedArtistId] = useState<string>("")
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([])
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError("Title is required")
    if (!audioFile && !audioUrl) return setError("Audio is required")
    if (!duration || Number(duration) <= 0)
      return setError("Unable to read audio duration")
    setLoadingSubmit(true)
    setError(null)
    try {
      let finalAudioUrl: string
      let lyrics
      if (audioFile) {
        const upUrl = await uploadAudio(audioFile, `albums/${albumId}/`)
        finalAudioUrl = upUrl
        lyrics = await lyricService.getLyrics(
          audioFile,
          currentArtistName || "Unknown",
          title
        )
      } else {
        finalAudioUrl = audioUrl as string
        const res = await fetch(finalAudioUrl)
        const blob = await res.blob()
        const file = new File([blob], "audio.mp3", {
          type: blob.type || "audio/mpeg",
        })
        lyrics = await lyricService.getLyrics(
          file,
          currentArtistName || "Unknown",
          title
        )
      }
      await trackService.create({
        title: title.trim(),
        audio: finalAudioUrl,
        duration: Math.round(Number(duration)),
        albumId,
        artistIds: selectedArtistIds,
        lyrics: lyrics,
      })
      setOpen(false)
      setTitle("")
      setAudioFile(null)
      setAudioUrl(null)
      setDuration(null)
      if (fileRef.current) fileRef.current.value = ""
      setSelectedArtistId("")
      setSelectedArtistIds([])
      onCreated?.()
      router.refresh()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create track"
      setError(msg)
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Track</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Add Track</DialogTitle>
            <DialogDescription>Enter track details.</DialogDescription>
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
                            setAudioUrl(url)
                            const audio = new Audio()
                            audio.src = url
                            audio.addEventListener("loadedmetadata", () => {
                              setDuration(
                                isFinite(audio.duration)
                                  ? Math.round(audio.duration)
                                  : 0
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
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
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
              <Label htmlFor="track-audio">Audio File</Label>
              {audioUrl ? (
                <div className="flex items-center justify-between rounded border border-neutral-800 px-3 py-2">
                  <span className="text-sm text-neutral-300">
                    Using YouTube audio
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setAudioUrl(null)
                      setDuration(null)
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
                      setDuration(null)
                      setAudioFile(null)
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
                          : 0
                      )
                      URL.revokeObjectURL(objectUrl)
                    })
                    audio.addEventListener("error", () => {
                      setError("Failed to load audio file")
                      setDuration(null)
                      URL.revokeObjectURL(objectUrl)
                    })
                  }}
                />
              )}
              {!!duration && (
                <p className="text-sm text-neutral-400">
                  Duration: {Math.floor(duration / 60)}:
                  {String(duration % 60).padStart(2, "0")}
                </p>
              )}
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
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
