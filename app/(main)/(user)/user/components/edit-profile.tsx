"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import type { UserRequestDto } from "@/dto/user"
import { uploadImage } from "@/services/storage-service"
import { userService } from "@/services/user-service"
import { HiOutlinePencil } from "react-icons/hi2"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

type Props = {
  closeDropdown: () => void
}

export function EditProfile({ closeDropdown }: Props) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useUser()

  const [form, setForm] = useState<{ name: string; profilePicture?: string }>({
    name: currentUser!.name || "",
    profilePicture: currentUser!.profilePicture,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | undefined>(
    currentUser!.profilePicture
  )

  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let profileUrl = form.profilePicture
      if (imageFile) {
        profileUrl = await uploadImage(
          imageFile,
          `user/${currentUser!.userId}/`
        )
      }

      const payload: Partial<UserRequestDto> = {
        name: form.name,
        profilePicture: profileUrl,
      }

      await userService.update(currentUser!.userId, payload)
      toast({ description: `Profile updated successfully.` })
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Failed to update profile:", err)
      toast({
        description: "Failed to update profile.",
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
        if (!isOpen) closeDropdown()
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <HiOutlinePencil />
          Edit Profile
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleUpdate} className="space-y-6 relative pb-12">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>

          <div className="flex gap-6">
            <label className="relative group w-40 h-40 flex-shrink-0 cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="profile picture"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 rounded-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <HiOutlinePencil size={28} className="text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              />
            </label>

            <div className="flex-1 grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/70">Display name</label>
                <Input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
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
