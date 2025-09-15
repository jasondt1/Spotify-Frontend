"use client"

import React, { useEffect, useRef, useState } from "react"
import type { ArtistResponseDto } from "@/dto/artist"
import type { GenreResponseDto } from "@/dto/genre"
import { artistService } from "@/services/artist-service"
import { uploadImage } from "@/services/storage-service"

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

interface UpdateArtistProps {
  artist: ArtistResponseDto
  onUpdated?: () => void
  genres?: GenreResponseDto[]
}

export default function UpdateArtist({
  artist,
  onUpdated,
  genres: genresProp,
}: UpdateArtistProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(artist.name)
  const [genreId, setGenreId] = useState(artist.genre?.id ?? "")
  const [genres, setGenres] = useState<GenreResponseDto[]>(genresProp || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    artist.image ?? null
  )
  const [imageError, setImageError] = useState<string | null>(null)
  const [removeExisting, setRemoveExisting] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (genresProp && genresProp.length > 0) setGenres(genresProp)
  }, [genresProp])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError("Name is required")
    if (!genreId) return setError("Genre is required")
    setLoading(true)
    setError(null)
    try {
      let image: string | undefined | null = undefined
      if (removeExisting && !imageFile) {
        image = ""
      }
      if (imageFile) {
        image = await uploadImage(imageFile, `artists/`)
      }
      await artistService.update(artist.id, {
        name: name.trim(),
        genreId,
        image: image ?? undefined,
      })
      setOpen(false)
      onUpdated?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update artist"
      setError(msg)
    } finally {
      setLoading(false)
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
            <DialogTitle>Edit Artist</DialogTitle>
            <DialogDescription>
              Update the artist details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label htmlFor="artist-name">Name</Label>
              <Input
                id="artist-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label>Genre</Label>
              <Select value={genreId} onValueChange={setGenreId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="artist-image">Image</Label>
              <Input
                id="artist-image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setImageError(null)
                  setRemoveExisting(false)
                  if (!file) return
                  if (!file.type.startsWith("image/")) {
                    setImageError("Please select a valid image file")
                    return
                  }
                  const maxSize = 2 * 1024 * 1024
                  if (file.size > maxSize) {
                    setImageError("Image must be <= 2MB")
                    return
                  }
                  if (imagePreview && imagePreview.startsWith("blob:")) {
                    URL.revokeObjectURL(imagePreview)
                  }
                  setImageFile(file)
                  setImagePreview(URL.createObjectURL(file))
                }}
              />
              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}
              {imagePreview && (
                <div className="mt-2 flex items-start gap-3 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full aspect-square object-cover rounded-md border"
                  />
                  <div className="flex gap-2 absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        if (imagePreview && imagePreview.startsWith("blob:")) {
                          URL.revokeObjectURL(imagePreview)
                        }
                        setImageFile(null)
                        setImagePreview(null)
                        setImageError(null)
                        setRemoveExisting(true)
                        if (fileInputRef.current)
                          fileInputRef.current.value = ""
                      }}
                    >
                      Remove Image
                    </Button>
                    {artist.image && !imageFile && !removeExisting && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setImagePreview(artist.image || null)
                          setRemoveExisting(false)
                        }}
                      >
                        Revert
                      </Button>
                    )}
                  </div>
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
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
