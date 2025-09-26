import Link from "next/link"
import type { ArtistSimpleDto } from "@/dto/artist"

interface Props {
  artists: ArtistSimpleDto[]
  limit?: number
}

function renderInitial(name: string) {
  return name ? name.charAt(0).toUpperCase() : "?"
}

export function ArtistsResult({ artists, limit }: Props) {
  const displayArtists =
    typeof limit === "number" ? artists.slice(0, limit) : artists

  if (!displayArtists.length) return null

  return (
    <div className="grid gap-0 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {displayArtists.map((artist) => (
        <Link
          key={artist.id}
          href={`/artists/${artist.id}`}
          className="group rounded-xl bg-neutral-900/60 p-4 transition hover:bg-neutral-800"
        >
          <div className="relative mb-2">
            {artist.image ? (
              <img
                src={artist.image}
                alt={artist.name}
                className="h-40 w-40 rounded-full object-cover mx-auto shadow-lg"
              />
            ) : (
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-neutral-800 text-4xl font-semibold text-neutral-400">
                {renderInitial(artist.name)}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-white">{artist.name}</p>
            <p className="font-medium text-sm text-neutral-400">Artist</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
