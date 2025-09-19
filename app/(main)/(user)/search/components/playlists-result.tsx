import Link from "next/link"
import type { PlaylistResponseDto } from "@/dto/playlist"

interface Props {
  playlists: PlaylistResponseDto[]
  limit?: number
}

function renderInitial(name: string) {
  return name ? name.charAt(0).toUpperCase() : "?"
}

export function PlaylistsResult({ playlists, limit }: Props) {
  const displayPlaylists =
    typeof limit === "number" ? playlists.slice(0, limit) : playlists

  if (!displayPlaylists.length) return null

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {displayPlaylists.map((playlist) => (
        <Link
          key={playlist.id}
          href={`/playlist/${playlist.id}`}
          className="group rounded-xl bg-neutral-900/60 p-4 transition hover:bg-neutral-800"
        >
          <div className="mb-2 overflow-hidden rounded-lg bg-neutral-800">
            {(() => {
              const uniqueAlbums =
                playlist.tracks?.reduce((acc: any[], track: any) => {
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
                  <div className="grid grid-cols-2 grid-rows-2 w-full aspect-square">
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
              return playlist.image ? (
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover"
                />
              ) : playlist.tracks?.length > 0 &&
                playlist.tracks[0].album?.image ? (
                <img
                  src={playlist.tracks[0].album.image}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center text-3xl font-semibold text-neutral-500">
                  {renderInitial(playlist.name)}
                </div>
              )
            })()}
          </div>

          <div>
            <p
              className="font-semibold text-white truncate"
              title={playlist.name}
            >
              {playlist.name}
            </p>
            <p className="text-sm text-neutral-400 font-medium">
              by {playlist.owner?.name || "Unknown"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
