import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import type {
  AlbumResponseDto,
  ArtistDetailsResponseDto,
  ArtistResponseDto,
  TopTrackDto,
} from "@/dto/artist"
import { artistService } from "@/services/artist-service"
import { getYear } from "date-fns"
import { BsFillPatchCheckFill, BsThreeDots } from "react-icons/bs"

import { formatNumber } from "@/lib/format"
import { extractGradient } from "@/lib/gradient"
import ControlButton from "@/components/control-button"
import ShuffleToggle from "@/components/shuffle-toggle"
import { ArtistTrackRow } from "@/app/(main)/(user)/artists/components/artist-track-row"

export default async function ArtistDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let artist: ArtistResponseDto | null = null
  let error: string | null = null
  let topTracks: TopTrackDto[] = []
  let monthlyListeners = 0

  try {
    const details: ArtistDetailsResponseDto = await artistService.getDetails(
      params.id,
      5
    )

    artist = details.artist
    topTracks = details.topTracks
    monthlyListeners = details.monthlyListeners
  } catch (e: any) {
    redirect("/not-found")
  }

  const coverImage = artist?.coverImage ?? null

  const gradient = artist?.coverImage
    ? await extractGradient(artist.coverImage)
    : ""

  return (
    <div className="rounded-xl relative">
      <div
        className="absolute inset-x-0 top-32 h-[400px]"
        style={{ background: gradient }}
      />
      <div
        className="flex items-start gap-6
    min-h-96 rounded-t-xl bg-cover bg-center bg-no-repeat relative"
        style={{
          background: coverImage
            ? `url(${coverImage})`
            : "linear-gradient(to bottom, #223337, #171717)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute left-10 bottom-10 drop-shadow-lg">
          <div className="flex items-center gap-2 text-lg mb-2">
            <div className="relative flex items-center justify-center w-6 h-6">
              <div className="absolute w-3 h-3 bg-white rounded-full" />
              <BsFillPatchCheckFill
                className="text-cyan-500 relative"
                size={24}
              />
            </div>
            <span className="text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
              Verified Artist
            </span>
          </div>

          <h1 className="text-8xl font-bold text-white tracking-tighter cursor-default [text-shadow:0_4px_24px_rgba(0,0,0,0.2)]">
            {artist?.name}
          </h1>

          <div className="text-lg mt-4 font-semibold text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]">
            {formatNumber(monthlyListeners)} monthly listeners
          </div>
        </div>
      </div>
      <div className="flex flex-col relative z-10">
        <div className="flex items-center gap-6 px-6 mt-6">
          <ControlButton
            artistId={artist?.id}
            firstTrackId={topTracks?.[0]?.track.id}
          />

          <ShuffleToggle sourceId={artist?.id} />
        </div>
        <div className="p-4 relative">
          <p className="text-2xl font-bold mb-3 ml-3 mt-2">Popular</p>
          <div className="space-y-2">
            {error && (
              <div className="p-3 text-red-500 bg-red-500/10 rounded-md">
                {error}
              </div>
            )}

            {!error && artist?.albums?.length === 0 && (
              <div className="p-3 text-gray-400 bg-white/5 rounded-md">
                No albums found.
              </div>
            )}

            <div className="flex flex-col">
              {topTracks?.map((tt: TopTrackDto, idx: number) => (
                <ArtistTrackRow
                  key={tt.track.id}
                  track={tt}
                  index={idx + 1}
                  artistId={artist?.id!}
                />
              ))}
            </div>
          </div>

          <p className="text-2xl font-bold mb-3 ml-3 mt-8">Albums</p>
          <div className="flex">
            {artist?.albums?.map((al: AlbumResponseDto) => (
              <Link
                key={al.id}
                href={`/album/${al.id}`}
                className="p-3 bg-transparent hover:bg-white/5 rounded-lg transition-all duration-200 ease-in-out cursor-pointer block"
              >
                <img
                  src={al.image}
                  alt={al.title}
                  className="mb-2 rounded-lg w-48 h-48 object-cover"
                />
                <div className="mb-1">
                  <p className="font-semibold">{al.title}</p>
                  <p className="font-semibold text-sm text-neutral-400">
                    {getYear(al.releaseDate)} • Album
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const token = cookies().get("access_token")?.value
  try {
    const artist = await artistService.getById(params.id, token)
    const title = artist?.name
      ? `${artist.name} | Spotify Artist`
      : "Spotify Artist"
    return { title }
  } catch {
    return { title: "Spotify Artist" }
  }
}
