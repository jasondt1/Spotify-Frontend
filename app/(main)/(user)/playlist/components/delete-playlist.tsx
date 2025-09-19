"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { PlaylistResponseDto } from "@/dto/playlist"
import { playlistService } from "@/services/playlist-service"
import { HiOutlineTrash } from "react-icons/hi2"

import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

type Props = {
  playlist: PlaylistResponseDto
  closeDropdown: () => void
}

export function DeletePlaylist({ playlist, closeDropdown }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const { fetchLibraries, fetchPlaylists } = useUser()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      await playlistService.remove(playlist.id)
      toast({ description: `Successfully deleted "${playlist.name}".` })
      await fetchLibraries()
      await fetchPlaylists()
      router.push("/")
    } catch (err) {
      console.error("Failed to delete playlist:", err)
      toast({
        description: "Failed to delete playlist.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <HiOutlineTrash />
            Delete
          </DropdownMenuItem>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete playlist "{playlist.name}"?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The playlist and its tracks will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={() => {
              setOpen(false)
              closeDropdown()
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
