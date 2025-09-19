import Link from "next/link"
import type { TopSearchResultDto } from "@/dto/search"

function renderInitial(name: string) {
  return name ? name.charAt(0).toUpperCase() : "?"
}

export function TopResult({ top }: { top: TopSearchResultDto }) {
  if (!top) return null

  return (
    <section className="space-y-3 w-full">
      <h2 className="text-2xl font-bold text-white ml-4">Top Result</h2>
      <div className="flex gap-4 rounded-xl bg-neutral-800/60 p-4 py-6 hover:bg-neutral-800 transition cursor-pointer">
        {top.type === "artist" && top.artist && (
          <TopResultArtist artist={top.artist} />
        )}
        {top.type === "album" && top.album && (
          <TopResultAlbum album={top.album} />
        )}
        {top.type === "track" && top.track && (
          <TopResultTrack track={top.track} />
        )}
        {top.type === "playlist" && top.playlist && (
          <TopResultPlaylist playlist={top.playlist} />
        )}
      </div>
    </section>
  )
}

function TopResultArtist({ artist }: { artist: TopSearchResultDto["artist"] }) {
  return (
    <div className="flex flex-col gap-4">
      <Link href={`/artists/${artist!.id}`} className="flex-shrink-0">
        {artist!.image ? (
          <img
            src={artist!.image}
            alt={artist!.name}
            className="h-28 w-28 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-neutral-800 text-3xl font-semibold text-neutral-400">
            {renderInitial(artist!.name)}
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-center gap-2">
        <Link
          href={`/artists/${artist!.id}`}
          className="text-3xl font-bold text-white hover:underline"
        >
          {artist!.name}
        </Link>
        <p className="text-sm text-neutral-400 font-semibold">Artist</p>
      </div>
    </div>
  )
}

function TopResultAlbum({ album }: { album: TopSearchResultDto["album"] }) {
  return (
    <div className="flex flex-col gap-4">
      <Link href={`/album/${album!.id}`} className="flex-shrink-0">
        {album!.image ? (
          <img
            src={album!.image}
            alt={album!.title}
            className="h-28 w-28 rounded-lg object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-neutral-800 text-3xl font-semibold text-neutral-400">
            {renderInitial(album!.title)}
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-center gap-2">
        <Link
          href={`/album/${album!.id}`}
          className="text-3xl font-bold text-white hover:underline"
        >
          {album!.title}
        </Link>
        <p className="text-sm text-neutral-400 font-semibold">
          Album •{" "}
          <Link
            className="hover:underline text-white"
            href={`/artists/${album!.artist?.id}`}
          >
            {album!.artist?.name}
          </Link>
        </p>
      </div>
    </div>
  )
}

function TopResultTrack({ track }: { track: TopSearchResultDto["track"] }) {
  return (
    <div className="flex flex-col gap-4">
      <Link href={`/track/${track!.id}`} className="flex-shrink-0">
        {track?.album!.image ? (
          <img
            src={track?.album!.image}
            alt={track?.album!.title}
            className="h-28 w-28 rounded-lg object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-neutral-800 text-3xl font-semibold text-neutral-400">
            {renderInitial(track?.album!.title!)}
          </div>
        )}
      </Link>
      <div className="flex flex-col justify-center gap-2">
        <Link
          href={`/track/${track!.id}`}
          className="text-3xl font-bold text-white hover:underline"
        >
          {track!.title}
        </Link>
        <p className="text-sm text-neutral-400 font-semibold">
          Song •{" "}
          {track?.artists?.[0] && (
            <Link
              className="hover:underline text-white"
              href={`/artists/${track.artists[0].id}`}
            >
              {track.artists[0].name}
            </Link>
          )}
        </p>
      </div>
    </div>
  )
}

function TopResultPlaylist({
  playlist,
}: {
  playlist: TopSearchResultDto["playlist"]
}) {
  return (
    <div className="flex flex-col gap-4">
      <Link href={`/playlist/${playlist!.id}`} className="flex-shrink-0">
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
              <div className="grid grid-cols-2 grid-rows-2 h-28 w-28 rounded-lg overflow-hidden shadow-lg">
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

          return playlist!.image ? (
            <img
              src={playlist!.image}
              alt={playlist!.name}
              className="h-28 w-28 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-neutral-800 text-3xl font-semibold text-neutral-400 shadow-lg">
              {renderInitial(playlist!.name)}
            </div>
          )
        })()}
      </Link>

      <div className="flex flex-col justify-center gap-2">
        <Link
          href={`/playlist/${playlist!.id}`}
          className="text-3xl font-bold text-white hover:underline"
        >
          {playlist!.name}
        </Link>
        <p className="text-sm text-neutral-400 font-semibold">
          Playlist •{" "}
          <Link
            className="hover:underline text-white"
            href={`/profile/${playlist!.ownerId}`}
          >
            {playlist!.owner?.name}
          </Link>
        </p>
      </div>
    </div>
  )
}
