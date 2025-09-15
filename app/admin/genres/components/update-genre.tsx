"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { GenreResponseDto } from "@/dto/genre"
import { genreService } from "@/services/genre-service"

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

interface UpdateGenreProps {
  genre: GenreResponseDto
  onUpdated?: () => void
}

export default function UpdateGenre({ genre, onUpdated }: UpdateGenreProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(genre.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await genreService.update(genre.id, { name: name.trim() })
      setOpen(false)
      onUpdated?.()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update genre"
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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Edit Genre</DialogTitle>
            <DialogDescription>Update the genre name below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-3">
              <Label htmlFor="genre-name">Name</Label>
              <Input
                id="genre-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
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
