import { cookies } from "next/headers"
import Link from "next/link"
import type { AlbumResponseDto, ArtistResponseDto } from "@/dto/artist"
import { albumService } from "@/services/album-service"
import { artistService } from "@/services/artist-service"

import { formatShortDate } from "@/lib/date"
import { formatDuration } from "@/lib/format"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import CreateTrack from "./components/create-track"
import DeleteTrack from "./components/delete-track"
import UpdateTrack from "./components/update-track"
import ViewLyrics from "./components/view-lyrics"

export default async function AlbumDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let album: AlbumResponseDto | null = null
  let artists: ArtistResponseDto[] = []
  let error: string | null = null

  try {
    const token = cookies().get("access_token")?.value
    if (!token) throw new Error("Unauthorized")

    album = await albumService.getById(params.id, token)
    artists = await artistService.getAll(token)
  } catch (e: any) {
    error =
      e?.response?.data?.message || e?.message || "Failed to load album detail"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        {album?.image ? (
          <img
            src={album.image}
            alt={album.title}
            className="h-28 w-28 object-cover rounded-md border"
          />
        ) : (
          <div className="h-28 w-28 rounded-md border bg-neutral-800" />
        )}
        <div className="flex flex-col gap-2 min-w-0">
          <h1 className="text-3xl font-bold leading-tight truncate">
            {album?.title ?? "Album"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {album?.artist && (
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1">
                {album.artist.image ? (
                  <img
                    src={album.artist.image}
                    alt={album.artist.name}
                    className="h-5 w-5 rounded-full object-cover border"
                  />
                ) : (
                  <span className="h-5 w-5 rounded-full border bg-neutral-700" />
                )}
                <Link
                  href={`/admin/artists/${album.artist.id}`}
                  className="hover:underline"
                >
                  {album.artist.name}
                </Link>
              </span>
            )}
            {album?.artist?.genre?.name && (
              <span className="rounded-full bg-neutral-800 px-3 py-1">
                {album.artist.genre.name}
              </span>
            )}
            <span className="rounded-full bg-neutral-800 px-3 py-1">
              {album?.releaseDate
                ? formatShortDate(album.releaseDate)
                : "Release date N/A"}
            </span>
          </div>
          <Link
            href={`/admin/artists/${album?.artist?.id}`}
            className="text-sm text-primary underline mt-1 w-fit"
          >
            Back to artist
          </Link>
        </div>
      </div>

      <div>
        {album?.id && (
          <div className="mb-4">
            <CreateTrack
              albumId={album.id}
              currentArtistId={album.artist?.id}
              currentArtistName={album.artist?.name}
              artists={artists}
            />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]">No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Artists</TableHead>
              <TableHead>Audio</TableHead>
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
            {!error && album?.tracks?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>No tracks found.</TableCell>
              </TableRow>
            )}
            {album?.tracks?.map((t, idx) => (
              <TableRow key={t.id}>
                <TableCell className="text-xs md:text-sm">{idx + 1}</TableCell>
                <TableCell className="font-medium">{t.title}</TableCell>
                <TableCell>{formatDuration(t.duration)}</TableCell>
                <TableCell>
                  {t.artists && t.artists.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {t.artists.map((a) => (
                        <Link
                          key={a.id}
                          href={`/admin/artists/${a.id}`}
                          className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs hover:bg-neutral-700 hover:underline"
                        >
                          {a.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {t.audio ? (
                    <audio controls src={t.audio} className="max-w-[240px]" />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3">
                    <ViewLyrics track={t} />
                    <UpdateTrack
                      track={t}
                      albumId={album.id}
                      currentArtistId={album.artist?.id}
                      currentArtistName={album.artist?.name}
                      artists={artists}
                    />
                    <DeleteTrack trackId={t.id} />
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
