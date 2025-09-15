import { cookies } from "next/headers"
import Link from "next/link"
import type { AlbumResponseDto, ArtistResponseDto } from "@/dto/artist"
import { artistService } from "@/services/artist-service"

import { formatShortDate } from "@/lib/date"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CreateAlbum from "./components/create-album"
import DeleteAlbum from "./components/delete-album"
import UpdateAlbum from "./components/update-album"

export default async function ArtistDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let artist: ArtistResponseDto | null = null
  let error: string | null = null

  try {
    const token = cookies().get("access_token")?.value
    if (!token) throw new Error("Unauthorized")

    artist = await artistService.getById(params.id, token)
  } catch (e: any) {
    error = e?.response?.data?.message || e?.message || "Failed to load artist"
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start gap-6">
        {artist?.image ? (
          <img
            src={artist.image}
            alt={artist.name}
            className="h-28 w-28 object-cover rounded-md border"
          />
        ) : (
          <div className="h-28 w-28 rounded-md border bg-neutral-800" />
        )}
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-3xl font-extrabold leading-tight truncate">
            {artist?.name ?? "Artist"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {artist?.genre?.name && (
              <span className="rounded-full bg-neutral-800 px-3 py-1">
                {artist.genre.name}
              </span>
            )}
            {artist?.albums && (
              <span className="rounded-full bg-neutral-800 px-3 py-1">
                Albums: {artist.albums.length}
              </span>
            )}
            {artist?.tracks && (
              <span className="rounded-full bg-neutral-800 px-3 py-1">
                Tracks: {artist.tracks.length}
              </span>
            )}
          </div>
          <Link
            href="/admin/artists"
            className="text-sm text-primary underline mt-1 w-fit"
          >
            Back to artists
          </Link>
        </div>
      </div>

      {/* ALBUMS */}
      <div>
        {artist?.id && (
          <div className="mb-4">
            <CreateAlbum artistId={artist.id} />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]">No</TableHead>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Tracks</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell colSpan={6} className="text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            )}
            {!error && artist?.albums?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>No albums found.</TableCell>
              </TableRow>
            )}
            {artist?.albums?.map((al: AlbumResponseDto, idx: number) => (
              <TableRow key={al.id}>
                <TableCell className="text-xs md:text-sm">{idx + 1}</TableCell>
                <TableCell>
                  {al.image ? (
                    <Link
                      href={`/admin/albums/${al.id}`}
                      className="inline-block"
                    >
                      <img
                        src={al.image}
                        alt={al.title}
                        className="h-12 w-12 object-cover rounded-md border hover:opacity-90"
                      />
                    </Link>
                  ) : (
                    <Link
                      href={`/admin/albums/${al.id}`}
                      className="text-xs text-neutral-400 hover:underline"
                    >
                      No image
                    </Link>
                  )}
                </TableCell>
                <TableCell className="font-medium">{al.title}</TableCell>
                <TableCell>{formatShortDate(al.releaseDate)}</TableCell>
                <TableCell>{al.tracks?.length ?? 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/albums/${al.id}`}>View</Link>
                    </Button>
                    {artist?.id && (
                      <UpdateAlbum album={al} artistId={artist.id} />
                    )}
                    <DeleteAlbum albumId={al.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
