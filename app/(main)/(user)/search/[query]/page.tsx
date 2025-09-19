import { cookies } from "next/headers"
import type { SearchResponseDto } from "@/dto/search"
import { searchService } from "@/services/search-service"

import { SearchPageClient } from "../components/search-page-client"

export default async function SearchPage({
  params,
}: {
  params: { query: string }
}) {
  const decodedQuery = decodeURIComponent(params.query || "")

  let results: SearchResponseDto | null = null
  let error: string | null = null

  try {
    const token = cookies().get("access_token")?.value
    if (!token) throw new Error("You need to sign in to search the catalog.")
    results = await searchService.search(decodedQuery, token)
  } catch (err: any) {
    error =
      err?.response?.data?.message ||
      err?.message ||
      "We couldn't fetch search results right now."
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="p-6 text-sm text-neutral-400">
        We didn't find anything for "{decodedQuery}".
      </div>
    )
  }

  return <SearchPageClient decodedQuery={decodedQuery} results={results} />
}

export async function generateMetadata({
  params,
}: {
  params: { query: string }
}) {
  return { title: `Spotify — Search` }
}
