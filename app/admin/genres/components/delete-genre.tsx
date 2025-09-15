"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { genreService } from "@/services/genre-service"

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

interface DeleteGenreProps {
  genreId: string
  onDeleted?: () => void
}

export default function DeleteGenre({ genreId, onDeleted }: DeleteGenreProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleDelete = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      await genreService.delete(genreId)
      onDeleted?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete genre"
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
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
