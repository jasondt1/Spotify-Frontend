"use client"

import React, { useRef, useState } from "react"
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

interface CreateAlbumProps {
  artistId: string
  onCreated?: () => void
}

export default function CreateAlbum({ artistId, onCreated }: CreateAlbumProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

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
      let image: string | undefined
      if (imageFile) {
        image = await uploadImage(imageFile, `albums/${artistId}/`)
      }
      await albumService.create({
        title: title.trim(),
        artistId,
        image,
        releaseDate: toLocalYMD(releaseDate),
      })
      setOpen(false)
      setTitle("")
      setReleaseDate(undefined)
      if (imagePreview) URL.revokeObjectURL(imagePreview)
      setImageFile(null)
      setImagePreview(null)
      if (fileRef.current) fileRef.current.value = ""
      onCreated?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create album"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Album</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Create Album</DialogTitle>
            <DialogDescription>
              Enter album title and optional cover image.
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
                  if (!f) {
                    if (imagePreview) URL.revokeObjectURL(imagePreview)
                    setImageFile(null)
                    setImagePreview(null)
                    return
                  }
                  if (!f.type.startsWith("image/"))
                    return setImageError("Invalid image file")
                  const max = 2 * 1024 * 1024
                  if (f.size > max) return setImageError("Image must be <= 2MB")
                  if (imagePreview) URL.revokeObjectURL(imagePreview)
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
                  <Button
                    type="button"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      if (imagePreview) URL.revokeObjectURL(imagePreview)
                      setImageFile(null)
                      setImagePreview(null)
                      setImageError(null)
                      if (fileRef.current) fileRef.current.value = ""
                    }}
                  >
                    Remove Image
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
