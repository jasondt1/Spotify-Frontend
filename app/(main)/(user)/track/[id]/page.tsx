import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { TrackWithPlayCountResponseDto } from "@/dto/artist"
import { trackService } from "@/services/track-service"

import { getYear } from "@/lib/date"
import { formatDuration, formatNumber } from "@/lib/format"
import { extractGradient } from "@/lib/gradient"
import ControlButton from "@/components/control-button"
import { TrackDropdownMenu } from "@/components/track-dropdown-menu"
import { TrackLikedIndicator } from "@/components/track-liked-indicator"

export default async function TrackDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let track: TrackWithPlayCountResponseDto | null = null
  let error: string | null = null

  try {
    track = await trackService.getWithPlays(params.id)
  } catch (e: any) {
    redirect("/not-found")
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Track</h1>
        <p className="text-sm text-white/60">{error}</p>
      </div>
    )
  }

  const t = track!.track
  const coverImage = t?.album?.image || undefined
  const gradient = coverImage
    ? await extractGradient(coverImage)
    : "linear-gradient(to bottom, #223337, #171717)"

  const primaryArtist = (t?.artists?.length ?? 0) > 0 ? t!.artists![0] : null
  const albumYear = t?.album?.releaseDate
    ? getYear(t.album.releaseDate)
    : undefined

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
            src={t?.album?.image || "/placeholder-cover.png"}
            alt=""
            className="w-56 h-56 object-cover rounded"
          />

          <div className="flex flex-col mt-auto mb-2">
            <p className="font-semibold">Song</p>
            <h1 className="text-6xl font-bold text-white tracking-tighter cursor-default mb-4">
              {t?.title ?? "Unknown Title"}
            </h1>

            <div className="text-sm flex gap-1.5 items-center font-semibold text-white/60">
              {primaryArtist ? (
                <Link
                  href={`/artists/${primaryArtist.id}`}
                  className="hover:underline text-white font-bold flex gap-2 items-center"
                >
                  <img
                    src={primaryArtist.image || "/avatar-placeholder.png"}
                    alt=""
                    className="rounded-full w-6 h-6"
                  />
                  {primaryArtist.name}
                </Link>
              ) : (
                <span className="text-white/60">Unknown Artist</span>
              )}

              <span>•</span>

              {t?.album ? (
                <Link
                  href={`/album/${t.album.id}`}
                  className="text-white/80 hover:text-white hover:underline transition-colors"
                >
                  {t.album.title}
                </Link>
              ) : (
                <span className="text-white/60">—</span>
              )}

              <span>
                {" "}
                • {albumYear ?? "—"} • {formatDuration(t?.duration)} •{" "}
                {formatNumber(track?.playCount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 px-6 mt-6">
          <ControlButton trackId={t?.id} />
          <TrackLikedIndicator track={t!} isTrackDetailPage />
          <TrackDropdownMenu track={t!} isDetailPage />
        </div>

        <div className="px-6 mt-10">
          <h2 className="text-2xl font-bold mb-4">Lyrics</h2>
          {t?.lyrics && t.lyrics.length > 0 ? (
            (() => {
              const cleaned = t.lyrics
                .map((line) => ({
                  ...line,
                  text: (line.text || "").replace("♪♪♪", "").trim(),
                }))
                .filter((line) => line.text.length > 0)

              return cleaned.length ? (
                <div className="whitespace-pre-line text-white/90 leading-7">
                  {cleaned.map((line, i) => (
                    <div key={i}>{line.text}</div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No lyrics available.</p>
              )
            })()
          ) : (
            <p className="text-white/60">No lyrics available.</p>
          )}
        </div>

        {t?.artists && t.artists.length > 0 && (
          <div className="px-6 mt-10 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="flex items-center gap-4 rounded-lg p-3 hover:bg-white/5 transition-colors"
                >
                  <img
                    src={artist.image || "/avatar-placeholder.png"}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-white/50">
                      Artist
                    </span>
                    <span className="text-white font-semibold">
                      {artist.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const token = cookies().get("access_token")?.value
  try {
    const track = await trackService.getWithPlays(params.id, token)
    const title = track?.track.title
      ? `${track.track.title} | Spotify Song`
      : "Spotify Song"
    return { title }
  } catch {
    return { title: "Spotify Song" }
  }
}
