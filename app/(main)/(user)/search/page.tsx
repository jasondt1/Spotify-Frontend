"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import type { SearchResponseDto } from "@/dto/search"
import { searchService } from "@/services/search-service"

import { AlbumsResult } from "./components/albums-result"
import { ArtistsResult } from "./components/artists-result"
import { FullTracksResult } from "./components/full-tracks-result"
import LoadingScreen from "./components/loading-screen"
import NoResult from "./components/no-result"
import { PlaylistsResult } from "./components/playlists-result"
import { SearchTabs } from "./components/search-tabs"
import SectionTitle from "./components/section-title"
import { TopResult } from "./components/top-result"
import { TracksResult } from "./components/tracks-result"

export default function SearchPage() {
  const params = useParams<{ query: string | string[] }>()
  const raw = Array.isArray(params?.query)
    ? params.query[0]
    : params?.query || ""
  const decodedQuery = useMemo(() => decodeURIComponent(raw), [raw])

  const [tab, setTab] = useState<
    "all" | "songs" | "artists" | "albums" | "playlists"
  >("all")
  const [results, setResults] = useState<SearchResponseDto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    const q = decodedQuery.trim()

    setLoading(true)
    setError(null)
    setResults(null)
    ;(async () => {
      try {
        const res = await searchService.search(q) // q bisa kosong
        if (!ignore) {
          setResults({
            ...res,
            albums: res?.albums ?? [],
            artists: res?.artists ?? [],
            tracks: res?.tracks ?? [],
            playlists: res?.playlists ?? [],
          })
        }
      } catch (e: any) {
        if (!ignore) {
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "We couldn't fetch search results right now."
          setError(msg)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    })()

    return () => {
      ignore = true
    }
  }, [decodedQuery])

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      </div>
    )
  }

  if (loading) return <LoadingScreen />

  const hasAnyResults = !!(
    results?.albums?.length ||
    results?.artists?.length ||
    results?.tracks?.length ||
    results?.playlists?.length
  )

  if (!results || !hasAnyResults) {
    return (
      <div className="p-6">
        <NoResult label="Results" query={decodedQuery} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <SearchTabs activeTab={tab} onChange={(v) => setTab(v as any)} />

      <div className="flex flex-col mt-6 gap-10">
        {tab === "all" && results.top && (
          <div className="flex gap-4">
            <div className="w-full md:w-2/5">
              <TopResult top={results.top} />
            </div>
            <div className="w-full md:w-3/5 space-y-3">
              <SectionTitle label="Songs" onClick={() => setTab("songs")} />
              <TracksResult
                tracks={results.tracks ?? []}
                query={decodedQuery}
              />
            </div>
          </div>
        )}

        {tab === "songs" &&
          ((results.tracks?.length ?? 0) > 0 ? (
            <section className="space-y-3">
              <FullTracksResult tracks={results.tracks ?? []} />
            </section>
          ) : (
            <NoResult label="Songs" query={decodedQuery} />
          ))}

        {(tab === "all" || tab === "artists") &&
          ((results.artists?.length ?? 0) > 0 ? (
            <section className="space-y-3">
              {tab === "all" && (
                <SectionTitle
                  label="Artists"
                  onClick={() => setTab("artists")}
                />
              )}
              <ArtistsResult
                artists={results.artists ?? []}
                limit={tab === "all" ? 5 : undefined}
              />
            </section>
          ) : tab === "artists" ? (
            <NoResult label="Artists" query={decodedQuery} />
          ) : null)}

        {(tab === "all" || tab === "albums") &&
          ((results.albums?.length ?? 0) > 0 ? (
            <section className="space-y-3">
              {tab === "all" && (
                <SectionTitle label="Albums" onClick={() => setTab("albums")} />
              )}
              <AlbumsResult albums={results.albums ?? []} />
            </section>
          ) : tab === "albums" ? (
            <NoResult label="Albums" query={decodedQuery} />
          ) : null)}

        {(tab === "all" || tab === "playlists") &&
          ((results.playlists?.length ?? 0) > 0 ? (
            <section className="space-y-3">
              {tab === "all" && (
                <SectionTitle
                  label="Playlists"
                  onClick={() => setTab("playlists")}
                />
              )}
              <PlaylistsResult playlists={results.playlists ?? []} />
            </section>
          ) : tab === "playlists" ? (
            <NoResult label="Playlists" query={decodedQuery} />
          ) : null)}
      </div>
    </div>
  )
}
