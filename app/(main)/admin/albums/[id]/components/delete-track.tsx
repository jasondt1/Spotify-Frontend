"use client"

import React, { useState } from "react"
import { trackService } from "@/services/track-service"

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

interface DeleteTrackProps {
  trackId: string
  onDeleted?: () => void
}

export default function DeleteTrack({ trackId, onDeleted }: DeleteTrackProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      await trackService.delete(trackId)
      onDeleted?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete track"
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
          <AlertDialogTitle>Delete track?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            track.
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
