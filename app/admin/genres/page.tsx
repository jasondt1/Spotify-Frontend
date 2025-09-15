import { cookies } from "next/headers"
import type { GenreResponseDto } from "@/dto/genre"
import { genreService } from "@/services/genre-service"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CreateGenre from "./components/create-genre"
import DeleteGenre from "./components/delete-genre"
import UpdateGenre from "./components/update-genre"

export default async function GenresPage() {
  let genres: GenreResponseDto[] = []
  let error: string | null = null

  try {
    const token = cookies().get("access_token")?.value
    if (token) {
      genres = await genreService.getAll(token)
    } else {
      error = "Unauthorized: no token"
    }
  } catch (e: any) {
    error = e?.response?.data?.message || e?.message || "Failed to load genres"
  }

  return (
    <div>
      <div className="mb-4">
        <CreateGenre />
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
          {!error && genres.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No genres found.</TableCell>
            </TableRow>
          )}
          {genres.map((g, idx) => (
            <TableRow key={g.id}>
              <TableCell className="text-xs md:text-sm">{idx + 1}</TableCell>
              <TableCell className="font-medium">{g.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-3">
                  <UpdateGenre genre={g} />
                  <DeleteGenre genreId={g.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
