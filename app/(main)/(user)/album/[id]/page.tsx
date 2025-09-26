import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AlbumResponseDto } from "@/dto/artist"
import { albumService } from "@/services/album-service"

import { getYear } from "@/lib/date"
import { formatTotalDuration } from "@/lib/format"
import { extractGradient } from "@/lib/gradient"
import ControlButton from "@/components/control-button"
import ShuffleToggle from "@/components/shuffle-toggle"
import { AlbumTrackHeader } from "@/app/(main)/(user)/album/components/album-track-header"
import { AlbumTrackRow } from "@/app/(main)/(user)/album/components/album-track-row"

import { AlbumDropdownMenu } from "../components/album-dropdown-menu"

export default async function AlbumDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let album: AlbumResponseDto | null = null
  let error: string | null = null

  try {
    album = await albumService.getById(params.id)
  } catch (e: any) {
    redirect("/not-found")
  }

  const totalSeconds =
    album?.tracks!.reduce((sum, track) => sum + (track.duration || 0), 0) ?? 0

  const coverImage =
    album?.image || album?.tracks?.[0]?.album?.image || undefined

  const gradient = coverImage
    ? await extractGradient(coverImage)
    : "linear-gradient(to bottom, #223337, #171717)"

  return (
    <div className="relative">
      <div
        className="absolute inset-x-0 top-0 h-[400px]"
        style={{ background: gradient }}
      />
      <div className="absolute inset-x-0 top-[17.2rem] h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

      <div className="flex flex-col relative z-10">
        <div className="header p-6 flex gap-8">
          <img
            src={album?.tracks[0]?.album?.image}
            alt=""
            className="w-56 h-56 object-cover rounded"
          />

          <div className="flex flex-col mt-auto mb-2">
            <p className="font-semibold">Album</p>
            <h1 className="text-6xl font-bold text-white tracking-tighter cursor-default mb-4">
              {album?.title}
            </h1>
            <div className="text-sm flex gap-1.5 items-center font-semibold text-white/60">
              <Link
                href={`/artists/${album?.artist?.id}`}
                className="hover:underline text-white font-bold flex gap-2 items-center"
              >
                <img
                  src={album?.artist?.image}
                  alt=""
                  className="rounded-full w-6 h-6"
                />
                {album?.artist?.name}
              </Link>{" "}
              {(album?.tracks?.length ?? 0) > 0 && (
                <span>
                  • {getYear(album?.createdAt)} • {album?.tracks.length}{" "}
                  {album?.tracks.length === 1 ? "song" : "songs"},{" "}
                  {formatTotalDuration(totalSeconds)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 px-6 mt-6">
          {album?.tracks?.length ? (
            <>
              <ControlButton
                albumId={album.id}
                firstTrackId={album.tracks[0].id}
              />
              <ShuffleToggle sourceId={album.id} />
            </>
          ) : null}

          {album && (
            <AlbumDropdownMenu
              album={album}
              enableAddToQueue={!!album.tracks?.length}
            />
          )}
        </div>

        <div className="tracks mt-4">
          <AlbumTrackHeader />
          {album?.tracks.map((track, index) => (
            <AlbumTrackRow key={track.id} track={track} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const token = cookies().get("access_token")?.value
  try {
    const album = await albumService.getById(params.id, token)
    const title = album?.title
      ? `${album.title} | Spotify Album`
      : "Spotify Album"
    return { title }
  } catch {
    return { title: "Spotify Album" }
  }
}
