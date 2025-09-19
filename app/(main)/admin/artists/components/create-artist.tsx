"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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

interface CreateArtistProps {
  onCreated?: () => void
  genres?: GenreResponseDto[]
}

export default function CreateArtist({
  onCreated,
  genres: genresProp,
}: CreateArtistProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [genreId, setGenreId] = useState("")
  const [genres, setGenres] = useState<GenreResponseDto[]>(genresProp || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverError, setCoverError] = useState<string | null>(null)
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
      let image: string | undefined
      let coverImage: string | undefined
      if (imageFile) {
        image = await uploadImage(imageFile, `artists/`)
      }
      if (coverFile) {
        coverImage = await uploadImage(coverFile, `artists/covers/`)
      }
      await artistService.create({
        name: name.trim(),
        genreId,
        image,
        coverImage,
      })
      setOpen(false)
      setName("")
      setGenreId("")
      setImageFile(null)
      setCoverFile(null)
      if (imagePreview) URL.revokeObjectURL(imagePreview)
      if (coverPreview) URL.revokeObjectURL(coverPreview)
      setImagePreview(null)
      setCoverPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (coverInputRef.current) coverInputRef.current.value = ""
      onCreated?.()
      router.refresh()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create artist"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Artist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-[90vh]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Create Artist</DialogTitle>
            <DialogDescription>
              Enter a name, select a genre, and upload images.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label htmlFor="artist-name">Name</Label>
              <Input
                id="artist-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Coldplay"
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
                  if (!file) {
                    if (imagePreview) URL.revokeObjectURL(imagePreview)
                    setImageFile(null)
                    setImagePreview(null)
                    return
                  }
                  if (!file.type.startsWith("image/")) {
                    setImageError("Please select a valid image file")
                    return
                  }
                  if (imagePreview) URL.revokeObjectURL(imagePreview)
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
                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      if (imagePreview) URL.revokeObjectURL(imagePreview)
                      setImageFile(null)
                      setImagePreview(null)
                      setImageError(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                  >
                    Remove
                  </Button>
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
                  if (!file) {
                    if (coverPreview) URL.revokeObjectURL(coverPreview)
                    setCoverFile(null)
                    setCoverPreview(null)
                    return
                  }
                  if (!file.type.startsWith("image/")) {
                    setCoverError("Please select a valid image file")
                    return
                  }
                  if (coverPreview) URL.revokeObjectURL(coverPreview)
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
                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      if (coverPreview) URL.revokeObjectURL(coverPreview)
                      setCoverFile(null)
                      setCoverPreview(null)
                      setCoverError(null)
                      if (coverInputRef.current)
                        coverInputRef.current.value = ""
                    }}
                  >
                    Remove
                  </Button>
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
