"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import type { GenreResponseDto } from "@/dto/genre"
import { genreService } from "@/services/genre-service"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CreateGenre from "./components/create-genre"
import DeleteGenre from "./components/delete-genre"
import UpdateGenre from "./components/update-genre"

export default function GenresPage() {
  const [genres, setGenres] = useState<GenreResponseDto[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    try {
      const data = await genreService.getAll()
      setGenres(data)
      setError(null)
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to load genres"
      )
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div>
      <div className="mb-4">
        <CreateGenre onCreated={refetch} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[64px]">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error && (
            <TableRow>
              <TableCell colSpan={3} className="text-red-500">
                {error}
              </TableCell>
            </TableRow>
          )}
          {!error && !genres && (
            <TableRow>
              <TableCell colSpan={3}>Loading…</TableCell>
            </TableRow>
          )}
          {!error && genres?.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No genres found.</TableCell>
            </TableRow>
          )}
          {genres?.map((g, idx) => (
            <TableRow key={g.id}>
              <TableCell className="text-xs md:text-sm">{idx + 1}</TableCell>
              <TableCell className="font-medium">{g.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-3">
                  <UpdateGenre genre={g} onUpdated={refetch} />
                  <DeleteGenre genreId={g.id} onDeleted={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
