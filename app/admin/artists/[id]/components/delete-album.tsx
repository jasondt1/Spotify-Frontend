"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { albumService } from "@/services/album-service"

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

interface DeleteAlbumProps {
  albumId: string
  onDeleted?: () => void
}

export default function DeleteAlbum({ albumId, onDeleted }: DeleteAlbumProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      await albumService.delete(albumId)
      onDeleted?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete album"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete album?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            album.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </AlertDialogContent>
    </AlertDialog>
  )
}
