import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PlaylistResponseDto } from "@/dto/playlist"
import { playlistService } from "@/services/playlist-service"
import { IoMdMusicalNotes } from "react-icons/io"

import { formatTotalDuration } from "@/lib/format"
import { extractGradient } from "@/lib/gradient"
import ControlButton from "@/components/control-button"
import ShuffleToggle from "@/components/shuffle-toggle"
import { PlaylistDropdownMenu } from "@/app/(main)/(user)/playlist/components/playlist-dropdown-menu"
import { PlaylistTrackHeader } from "@/app/(main)/(user)/playlist/components/playlist-track-header"
import { PlaylistTrackRow } from "@/app/(main)/(user)/playlist/components/playlist-track-row"

export default async function PlaylistDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let playlist: PlaylistResponseDto | null = null
  let error: string | null = null

  try {
    playlist = await playlistService.getById(params.id)
  } catch (e: any) {
    redirect("/not-found")
  }

  const totalSeconds =
    playlist?.tracks.reduce((sum, track) => sum + (track.duration || 0), 0) ?? 0

  const coverImage =
    playlist?.image || playlist?.tracks?.[0]?.album?.image || undefined

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
          {(() => {
            const uniqueAlbums =
              playlist?.tracks?.reduce((acc: any[], track: any) => {
                if (
                  track.album?.image &&
                  !acc.find((a) => a.id === track.album.id)
                ) {
                  acc.push(track.album)
                }
                return acc
              }, []) || []

            if (uniqueAlbums.length >= 4) {
              return (
                <div className="grid grid-cols-2 grid-rows-2 gap-0 w-56 h-56 rounded overflow-hidden">
                  {uniqueAlbums.slice(0, 4).map((album, i) => (
                    <img
                      key={i}
                      src={album.image}
                      alt={album.title || `Album ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              )
            }

            return playlist?.image ? (
              <img
                src={playlist.image}
                alt=""
                className="w-56 h-56 object-cover rounded"
              />
            ) : playlist?.tracks[0]?.album?.image ? (
              <img
                src={playlist.tracks[0].album.image}
                alt=""
                className="w-56 h-56 object-cover rounded"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-neutral-700 rounded">
                <IoMdMusicalNotes
                  className="text-neutral-300 text-3xl"
                  size={48}
                />
              </div>
            )
          })()}

          <div className="flex flex-col mt-auto mb-2">
            <p className="font-semibold">Playlist</p>
            <h1 className="text-6xl font-bold text-white tracking-tighter cursor-default mb-4">
              {playlist?.name}
            </h1>
            {playlist?.description && (
              <div className="mb-2 text-sm font-semibold text-white/60">
                {playlist.description}
              </div>
            )}
            <div className="text-sm font-semibold text-white/60 flex items-center gap-2">
              <img
                src={playlist?.owner.profilePicture}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
              />
              <Link
                className="font-bold text-white"
                href={`/user/${playlist?.owner.userId}`}
              >
                {playlist?.owner?.name}
              </Link>{" "}
              {(playlist?.tracks?.length ?? 0) > 0 && (
                <span>
                  • {playlist!.tracks!.length}{" "}
                  {playlist!.tracks!.length === 1 ? "song" : "songs"},{" "}
                  {formatTotalDuration(totalSeconds)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 px-6 mt-6">
          {playlist?.tracks?.length ? (
            <>
              <ControlButton
                playlistId={playlist.id}
                firstTrackId={playlist.tracks[0].id}
              />
              <ShuffleToggle sourceId={playlist.id} />
            </>
          ) : null}
          {playlist && (
            <PlaylistDropdownMenu
              playlist={playlist}
              enableAddToQueue={playlist.tracks.length > 0}
            />
          )}
        </div>

        <div className="tracks mt-4">
          {playlist?.tracks.length != 0 && <PlaylistTrackHeader />}
          {playlist?.tracks.map((track, index) => (
            <PlaylistTrackRow
              key={track.id}
              track={track}
              index={index + 1}
              playlistId={playlist.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const token = cookies().get("access_token")?.value
  try {
    const playlist = await playlistService.getById(params.id, token)
    const title = playlist?.name
      ? `${playlist.name} | Spotify Playlist`
      : "Spotify Playlist"
    return { title }
  } catch {
    return { title: "Spotify Playlist" }
  }
}
