"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-provider"
import type { ArtistResponseDto } from "@/dto/artist"
import type { GenreResponseDto } from "@/dto/genre"
import { artistService } from "@/services/artist-service"
import { genreService } from "@/services/genre-service"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CreateArtist from "./components/create-artist"
import DeleteArtist from "./components/delete-artist"
import UpdateArtist from "./components/update-artist"

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistResponseDto[] | null>(null)
  const [genres, setGenres] = useState<GenreResponseDto[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    try {
      const data = await artistService.getAll()
      setArtists(data)
      setError(null)
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to load artists"
      )
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    let cancelled = false
    if (genres) return
    ;(async () => {
      try {
        const list = await genreService.getAll()
        if (!cancelled) setGenres(list)
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [genres])

  return (
    <div>
      <div className="mb-4">
        <CreateArtist onCreated={refetch} genres={genres ?? undefined} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[64px]">No</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="text-red-500">
                {error}
              </TableCell>
            </TableRow>
          )}
          {!error && !artists && (
            <TableRow>
              <TableCell colSpan={5}>Loading…</TableCell>
            </TableRow>
          )}
          {!error && artists?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>No artists found.</TableCell>
            </TableRow>
          )}
          {artists?.map((a, idx) => (
            <TableRow key={a.id}>
              <TableCell className="text-xs md:text-sm">{idx + 1}</TableCell>
              <TableCell>
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.name}
                    className="h-12 w-12 object-cover rounded-md border"
                  />
                ) : (
                  <span className="text-xs text-neutral-500">No image</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{a.name}</TableCell>
              <TableCell>{a.genre?.name ?? "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-3">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/artists/${a.id}`}>View</Link>
                  </Button>
                  <UpdateArtist
                    artist={a}
                    onUpdated={refetch}
                    genres={genres ?? undefined}
                  />
                  <DeleteArtist artistId={a.id} onDeleted={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
