"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { PlaylistResponseDto, PlaylistUpdateDto } from "@/dto/playlist"
import { playlistService } from "@/services/playlist-service"
import { uploadImage } from "@/services/storage-service"
import { HiOutlinePencil } from "react-icons/hi2"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  playlist: PlaylistResponseDto
  closeDropdown: () => void
}

export function EditPlaylist({ playlist, closeDropdown }: Props) {
  const { toast } = useToast()
  const { fetchPlaylists, fetchLibraries } = useUser()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<PlaylistUpdateDto>({
    name: playlist.name,
    description: playlist.description,
    image: playlist.image,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | undefined>(
    playlist.image || playlist.tracks?.[0]?.album?.image
  )
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrl = form.image
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, `playlist/${playlist.id}/`)
      }

      await playlistService.update(playlist.id, { ...form, image: imageUrl })
      toast({ description: `Playlist "${form.name}" updated successfully.` })
      await fetchPlaylists()
      await fetchLibraries()
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Failed to update playlist:", err)
      toast({
        description: "Failed to update playlist.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      closeDropdown()
    }
  }

  const handleImageChange = (file: File | null) => {
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          closeDropdown()
        }
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <HiOutlinePencil />
          Edit Details
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleUpdate} className="space-y-6 relative pb-12">
          <DialogHeader>
            <DialogTitle>Edit details</DialogTitle>
          </DialogHeader>

          <div className="flex gap-6">
            <label className="relative group w-40 h-40 flex-shrink-0 cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="playlist cover"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 rounded-md flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                <HiOutlinePencil size={28} className="text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              />
            </label>

            <div className="flex-1 flex flex-col gap-4">
              <Input
                placeholder="Playlist name"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Textarea
                placeholder="Add an optional description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>

          <div className="absolute bottom-0 right-0 flex gap-2">
            <Button type="submit" disabled={loading} className="rounded-full">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
