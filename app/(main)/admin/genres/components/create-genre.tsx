"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
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

interface CreateGenreProps {
  onCreated?: () => void
}

export default function CreateGenre({ onCreated }: CreateGenreProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await genreService.create({ name: name.trim() })
      setOpen(false)
      setName("")
      onCreated?.()
      router.refresh()
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create genre"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Genre</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Create Genre</DialogTitle>
            <DialogDescription>
              Enter a name for the new genre.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-3">
              <Label htmlFor="genre-name">Name</Label>
              <Input
                id="genre-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pop"
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
