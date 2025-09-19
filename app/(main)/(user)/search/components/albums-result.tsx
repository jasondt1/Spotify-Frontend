import Link from "next/link"
import type { AlbumResponseDto } from "@/dto/artist"

import { getYear } from "@/lib/date"

interface Props {
  albums: AlbumResponseDto[]
  limit?: number
}

function renderInitial(name: string) {
  return name ? name.charAt(0).toUpperCase() : "?"
}

export function AlbumsResult({ albums, limit }: Props) {
  const displayAlbums =
    typeof limit === "number" ? albums.slice(0, limit) : albums

  if (!displayAlbums.length) return null

  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {displayAlbums.map((album) => (
        <Link
          key={album.id}
          href={`/album/${album.id}`}
          className="group rounded-xl bg-neutral-900/60 p-4 transition hover:bg-neutral-800"
        >
          <div className="mb-2 overflow-hidden rounded-lg bg-neutral-800">
            {album.image ? (
              <img
                src={album.image}
                alt={album.title}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="flex h-44 items-center justify-center text-4xl font-semibold text-neutral-500">
                {renderInitial(album.title)}
              </div>
            )}
          </div>
          <div>
            <p
              className="font-semibold text-white truncate"
              title={album.title}
            >
              {album.title}
            </p>
            <p className="text-sm text-neutral-400 font-medium">
              {getYear(album.releaseDate)}
              {album?.artist?.name ? (
                <>
                  <span className="px-1" aria-hidden>
                    {"\u2022"}
                  </span>
                  {album.artist.name}
                </>
              ) : null}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
