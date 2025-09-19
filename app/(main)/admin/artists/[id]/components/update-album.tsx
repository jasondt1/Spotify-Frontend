"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { AlbumResponseDto } from "@/dto/artist"
import { albumService } from "@/services/album-service"
import { uploadImage } from "@/services/storage-service"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface UpdateAlbumProps {
  album: AlbumResponseDto
  artistId: string
  onUpdated?: () => void
}

export default function UpdateAlbum({
  album,
  artistId,
  onUpdated,
}: UpdateAlbumProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(album.title)
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(
    album.releaseDate ? new Date(album.releaseDate) : undefined
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    album.image ?? null
  )
  const [imageError, setImageError] = useState<string | null>(null)
  const [removeExisting, setRemoveExisting] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const toLocalYMD = (d?: Date) => {
    if (!d) return undefined
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const da = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${da}`
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError("Title is required")
    setLoading(true)
    setError(null)
    try {
      let image: string | undefined | null = undefined
      if (removeExisting && !imageFile) image = ""
      if (imageFile) {
        image = await uploadImage(imageFile, `albums/${artistId}/`)
      }
      await albumService.update(album.id, {
        title: title.trim(),
        artistId,
        image: image ?? undefined,
        releaseDate: toLocalYMD(releaseDate),
      })
      setOpen(false)
      onUpdated?.()
      router.refresh()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update album"
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
            <DialogTitle>Edit Album</DialogTitle>
            <DialogDescription>
              Update album title, release date, or cover image.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-2">
              <Label htmlFor="album-title">Title</Label>
              <Input
                id="album-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label>Release Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!releaseDate}
                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {releaseDate ? (
                      releaseDate.toLocaleDateString()
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={releaseDate}
                    onSelect={setReleaseDate}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="album-image">Image</Label>
              <Input
                id="album-image"
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  setImageError(null)
                  setRemoveExisting(false)
                  if (!f) return
                  if (!f.type.startsWith("image/"))
                    return setImageError("Invalid image file")
                  const max = 2 * 1024 * 1024
                  if (f.size > max) return setImageError("Image must be <= 2MB")
                  if (imagePreview && imagePreview.startsWith("blob:"))
                    URL.revokeObjectURL(imagePreview)
                  setImageFile(f)
                  setImagePreview(URL.createObjectURL(f))
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
                        if (imagePreview && imagePreview.startsWith("blob:"))
                          URL.revokeObjectURL(imagePreview)
                        setImageFile(null)
                        setImagePreview(null)
                        setRemoveExisting(true)
                        if (fileRef.current) fileRef.current.value = ""
                      }}
                    >
                      Remove Image
                    </Button>
                    {album.image && !imageFile && !removeExisting && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setImagePreview(album.image || null)
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
