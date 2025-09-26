import { NextRequest, NextResponse } from "next/server"
import { createRequire } from "module"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()
  const limitParam = searchParams.get("limit")
  const limit = limitParam ? Math.max(1, Math.min(20, parseInt(limitParam))) : 8

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  try {
    // Ensure axios is available for CJS deps and use Node require
    await import("axios")
    const require = createRequire(import.meta.url)
    const ytsa = require("youtube-search-api") as any
    const data = await ytsa.GetListByKeyword(q, false, limit, [
      { type: "video" },
    ])

    const items = (data?.items || []).map((it: any) => {
      // Map thumbnails to best available url
      const thumbs = it.thumbnail?.thumbnails || it.thumbnail || []
      const thumb = Array.isArray(thumbs)
        ? thumbs[thumbs.length - 1]?.url || thumbs[0]?.url
        : thumbs?.url
      const length = it.length?.simpleText || it.length?.text || it.length || ""
      return {
        id: it.id,
        title: it.title,
        channelTitle: it.channelTitle || it.shortBylineText?.runs?.[0]?.text || "",
        durationText: typeof length === "string" ? length : "",
        isLive: !!it.isLive,
        thumbnail: thumb || "",
      }
    })

    return NextResponse.json({ items })
  } catch (err: any) {
    console.error("YouTube search failed", err)
    return NextResponse.json(
      { error: err?.message || "Search failed" },
      { status: 500 }
    )
  }
}
