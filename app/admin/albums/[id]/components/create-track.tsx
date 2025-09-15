"use client"

import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import type { ArtistResponseDto } from "@/dto/artist"
import { artistService } from "@/services/artist-service"
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
  artists?: ArtistResponseDto[]
}

export default function CreateTrack({
  albumId,
  onCreated,
  currentArtistId,
  artists: artistsProp,
}: CreateTrackProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [artists, setArtists] = useState<ArtistResponseDto[]>(artistsProp || [])
  const [selectedArtistId, setSelectedArtistId] = useState<string>("")
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([])

  useEffect(() => {
    if (artistsProp && artistsProp.length > 0) {
      const filtered = artistsProp.filter((a) => a.id !== currentArtistId)
      setArtists(filtered)
    }
  }, [artistsProp, currentArtistId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError("Title is required")
    if (!audioFile) return setError("Audio file is required")
    if (!duration || Number(duration) <= 0)
      return setError("Unable to read audio duration")
    setLoading(true)
    setError(null)
    try {
      const audioUrl = await uploadAudio(audioFile, `albums/${albumId}/`)
      await trackService.create({
        title: title.trim(),
        audio: audioUrl,
        duration: Math.round(Number(duration)),
        albumId,
        artistIds: selectedArtistIds,
      })
      setOpen(false)
      setTitle("")
      setAudioFile(null)
      setDuration(null)
      if (fileRef.current) fileRef.current.value = ""
      setSelectedArtistId("")
      setSelectedArtistIds([])
      onCreated?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create track"
      setError(msg)
    } finally {
      setLoading(false)
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
              <Label htmlFor="track-audio">Audio File</Label>
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
                    return
                  }
                  setAudioFile(file)
                  const objectUrl = URL.createObjectURL(file)
                  const audio = new Audio()
                  audio.src = objectUrl
                  audio.addEventListener("loadedmetadata", () => {
                    setDuration(
                      isFinite(audio.duration) ? Math.round(audio.duration) : 0
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
              <p className="text-sm text-neutral-400">
                {duration
                  ? `Duration: ${Math.floor(duration / 60)}:${String(
                      duration % 60
                    ).padStart(2, "0")}`
                  : "No file selected"}
              </p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
