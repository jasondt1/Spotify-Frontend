import { AlbumResponseDto } from "@/dto/artist"
import Link from "next/link"
import { IoMdMusicalNotes } from "react-icons/io"

interface Props {
  albums: AlbumResponseDto[]
  limit?: number
}

function renderInitial(name: string) {
  return <IoMdMusicalNotes className="text-neutral-300 text-lg" size={30} />
}

export function TopAlbums({ albums, limit }: Props) {
  const displayAlbums =
    typeof limit === "number" ? albums.slice(0, limit) : albums

  if (!displayAlbums.length) return null

  return (
    <div className="grid gap-0 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {displayAlbums.map((album) => (
        <Link
          key={album.id}
          href={`/albums/${album.id}`}
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
              <div className="flex w-full aspect-square items-center justify-center text-3xl font-semibold text-neutral-500">
                {renderInitial(album.title)}
              </div>
            )}
          </div>

          <div>
            <p
              className="font-bold text-white truncate text-lg"
              title={album.title}
            >
              {album.title}
            </p>
            <p className="text-sm text-neutral-400 font-medium">
              {album.artist?.name || "Unknown Artist"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
