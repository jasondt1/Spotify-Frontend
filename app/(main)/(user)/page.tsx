import { cookies } from "next/headers"
import { AlbumResponseDto, TopArtistDto, TopTrackDto } from "@/dto/artist"
import { historyService } from "@/services/history-service"

import { AlbumsResult } from "./search/components/albums-result"
import { TopArtists } from "./user/components/top-artists"
import { TopTracks } from "./user/components/top-tracks"

export default async function HomePage() {
  let topTracks: TopTrackDto[] | null = null
  let topArtists: TopArtistDto[] | null = null
  let topAlbums: AlbumResponseDto[] | null = null
  let error: string | null = null

  try {
    topTracks = await historyService.getTopTracksAllTime(10)
    topArtists = await historyService.getTopArtistsAllTime(10)
    topAlbums = await historyService.getTopAlbumsAllTime(10)
  } catch (e: any) {
    error = e?.response?.data?.message || e?.message || "Failed to load data"
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Home</h1>
        <p className="text-sm text-white/60">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 pb-0 pt-8">
      <section className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-4 ml-5">
          Popular artists
        </h2>
        <TopArtists artists={topArtists!} limit={10} />
      </section>

      <section className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-4 ml-5">
          Popular albums
        </h2>
        <AlbumsResult albums={topAlbums!} />
      </section>

      <section className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-4 ml-5">
          Trending songs
        </h2>
        <TopTracks tracks={topTracks!} limit={10} />
      </section>
    </div>
  )
}
