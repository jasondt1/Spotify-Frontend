"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
  const [removeImage, setRemoveImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(
    artist.coverImage ?? null
  )
  const [coverError, setCoverError] = useState<string | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

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
      let image: string | null | undefined = undefined
      let coverImage: string | null | undefined = undefined

      if (removeImage && !imageFile) image = ""
      if (removeCover && !coverFile) coverImage = ""

      if (imageFile) image = await uploadImage(imageFile, `artists/`)
      if (coverFile)
        coverImage = await uploadImage(coverFile, `artists/covers/`)

      await artistService.update(artist.id, {
        name: name.trim(),
        genreId,
        image: image ?? undefined,
        coverImage: coverImage ?? undefined,
      })

      setOpen(false)
      onUpdated?.()
      router.refresh()
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
      <DialogContent className="sm:max-w-[520px] overflow-y-auto max-h-[90vh]">
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
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setImageError(null)
                  setRemoveImage(false)
                  if (!file) return
                  if (!file.type.startsWith("image/")) {
                    setImageError("Please select a valid image file")
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
                <div className="mt-2 relative">
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
                        setRemoveImage(true)
                        if (imageInputRef.current)
                          imageInputRef.current.value = ""
                      }}
                    >
                      Remove
                    </Button>
                    {artist.image && !imageFile && !removeImage && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setImagePreview(artist.image || null)
                          setRemoveImage(false)
                        }}
                      >
                        Revert
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="artist-cover">Cover Image</Label>
              <Input
                id="artist-cover"
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setCoverError(null)
                  setRemoveCover(false)
                  if (!file) return
                  if (!file.type.startsWith("image/")) {
                    setCoverError("Please select a valid image file")
                    return
                  }
                  if (coverPreview && coverPreview.startsWith("blob:")) {
                    URL.revokeObjectURL(coverPreview)
                  }
                  setCoverFile(file)
                  setCoverPreview(URL.createObjectURL(file))
                }}
              />
              {coverError && (
                <p className="text-sm text-red-500">{coverError}</p>
              )}
              {coverPreview && (
                <div className="mt-2 relative">
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full aspect-video object-cover rounded-md border"
                  />
                  <div className="flex gap-2 absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        if (coverPreview && coverPreview.startsWith("blob:")) {
                          URL.revokeObjectURL(coverPreview)
                        }
                        setCoverFile(null)
                        setCoverPreview(null)
                        setRemoveCover(true)
                        if (coverInputRef.current)
                          coverInputRef.current.value = ""
                      }}
                    >
                      Remove
                    </Button>
                    {artist.coverImage && !coverFile && !removeCover && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setCoverPreview(artist.coverImage || null)
                          setRemoveCover(false)
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
