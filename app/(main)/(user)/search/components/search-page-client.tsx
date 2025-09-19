"use client"

import { useState } from "react"
import type { SearchResponseDto } from "@/dto/search"

import { AlbumsResult } from "./albums-result"
import { ArtistsResult } from "./artists-result"
import { FullTracksResult } from "./full-tracks-result"
import NoResult from "./no-result"
import { PlaylistsResult } from "./playlists-result"
import { SearchTabs } from "./search-tabs"
import { TopResult } from "./top-result"
import { TracksResult } from "./tracks-result"

interface SectionTitleProps {
  label: string
  onClick?: () => void
}

function SectionTitle({ label, onClick }: SectionTitleProps) {
  const baseClass = "text-2xl font-bold text-white ml-4 inline-block"
  const interactiveClass = onClick ? " hover:underline cursor-pointer" : ""

  return (
    <h2 className={baseClass + interactiveClass} onClick={onClick}>
      {label}
    </h2>
  )
}

export function SearchPageClient({
  decodedQuery,
  results,
}: {
  decodedQuery: string
  results: SearchResponseDto
}) {
  const [tab, setTab] = useState("all")

  const hasAnyResults = !!(
    results.albums.length ||
    results.artists.length ||
    results.tracks.length ||
    results.playlists.length
  )

  return (
    <div className="p-6">
      <SearchTabs activeTab={tab} onChange={setTab} />

      {tab === "all" && !hasAnyResults && (
        <NoResult label="Results" query={decodedQuery} />
      )}
      {tab === "songs" && results.tracks.length === 0 && (
        <NoResult label="Songs" query={decodedQuery} />
      )}
      {tab === "artists" && results.artists.length === 0 && (
        <NoResult label="Artists" query={decodedQuery} />
      )}
      {tab === "albums" && results.albums.length === 0 && (
        <NoResult label="Albums" query={decodedQuery} />
      )}
      {tab === "playlists" && results.playlists.length === 0 && (
        <NoResult label="Playlists" query={decodedQuery} />
      )}

      {hasAnyResults && (
        <div className="flex flex-col mt-6 gap-10">
          {tab === "all" && results.top && (
            <div className="flex gap-4">
              <div className="w-2/5">
                <TopResult top={results.top} />
              </div>
              <div className="w-3/5 space-y-3">
                <SectionTitle label="Songs" onClick={() => setTab("songs")} />
                <TracksResult
                  tracks={results.tracks ?? []}
                  query={decodedQuery}
                />
              </div>
            </div>
          )}

          {tab === "songs" && results.tracks.length > 0 && (
            <section className="space-y-3">
              <FullTracksResult tracks={results.tracks ?? []} />
            </section>
          )}

          {(tab === "all" || tab === "artists") &&
            results.artists.length > 0 && (
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
            )}

          {(tab === "all" || tab === "albums") && results.albums.length > 0 && (
            <section className="space-y-3">
              {tab === "all" && (
                <SectionTitle label="Albums" onClick={() => setTab("albums")} />
              )}
              <AlbumsResult albums={results.albums ?? []} />
            </section>
          )}

          {(tab === "all" || tab === "playlists") &&
            results.playlists.length > 0 && (
              <section className="space-y-3">
                {tab === "all" && (
                  <SectionTitle
                    label="Playlists"
                    onClick={() => setTab("playlists")}
                  />
                )}
                <PlaylistsResult playlists={results.playlists ?? []} />
              </section>
            )}
        </div>
      )}
    </div>
  )
}
