import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function uniqueName(ext = ".mp3") {
  const base =
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  return `${base}${ext.startsWith(".") ? ext : "." + ext}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("/api/youtube/download: incoming body", body)
    const videoId: string | undefined = body?.videoId
    const url: string | undefined = body?.url
    const albumId: string | undefined = body?.albumId
    const preferredExt: string = body?.ext || ".mp3"

    if (!videoId && !url) {
      console.error("Missing videoId/url in body")
      return NextResponse.json(
        { error: "Missing videoId or url" },
        { status: 400 }
      )
    }

    const ytUrl = url || `https://www.youtube.com/watch?v=${videoId}`
    console.log("Computed YouTube URL:", ytUrl)

    const uploadToSupabase = async (
      bytes: ArrayBuffer,
      contentType: string,
      extHint: string
    ) => {
      console.log("Uploading to Supabase...", { contentType, extHint })
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
      const SUPABASE_ANON_KEY = process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error("Supabase env not configured")
        return NextResponse.json(
          { error: "Supabase env not configured" },
          { status: 500 }
        )
      }
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

      const fileName = uniqueName(extHint)
      const pathPrefix = albumId ? `albums/${albumId}/` : "uploads/"
      const path = `${pathPrefix}${fileName}`
      console.log("Supabase path:", path)

      const { error } = await supabase.storage
        .from("audio")
        .upload(path, bytes, {
          contentType,
          upsert: false,
        })
      if (error) {
        console.error("Supabase upload failed", error)
        return NextResponse.json(
          { error: `Supabase upload failed: ${error.message}` },
          { status: 500 }
        )
      }
      const { data } = supabase.storage.from("audio").getPublicUrl(path)
      console.log("Supabase publicUrl:", data.publicUrl)
      return NextResponse.json({
        publicUrl: data.publicUrl,
        path,
        meta: {
          source: ytUrl,
        },
      })
    }

    // SSVID flow: search → convert → download
    const headers = {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      origin: "https://ssvid.net",
      referer: "https://ssvid.net/en12/youtube-to-mp3",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
      accept: "*/*",
    } as Record<string, string>

    const searchBody = new URLSearchParams()
    searchBody.set("hl", "en")
    searchBody.set("query", ytUrl)
    searchBody.set("cf_token", "vt")
    searchBody.set("vt", "youtube")
    console.log("SSVID search body:", searchBody.toString())

    const searchUrl = "https://ssvid.net/api/ajax/search?hl=en"
    console.log("POST", searchUrl)
    const searchRes = await fetch(searchUrl, {
      method: "POST",
      headers,
      body: searchBody.toString(),
    })
    console.log("Search status:", searchRes.status, searchRes.statusText)
    if (!searchRes.ok)
      throw new Error(`ssvid search failed ${searchRes.status}`)
    const searchJson: any = await searchRes.json()
    console.log("Search JSON keys:", Object.keys(searchJson || {}))
    if (searchJson?.status !== "ok")
      throw new Error(searchJson?.mess || "ssvid search error")

    const vid: string | undefined = searchJson?.vid
    const mp3k: string | undefined = searchJson?.links?.mp3?.mp3128?.k
    const m4ak: string | undefined = searchJson?.links?.m4a?.["140"]?.k
    console.log("Chosen keys -> vid:", vid, "mp3k:", !!mp3k, "m4ak:", !!m4ak)
    const fmt = mp3k
      ? { k: mp3k, ext: ".mp3", contentType: "audio/mpeg" }
      : m4ak
      ? { k: m4ak, ext: ".m4a", contentType: "audio/mp4" }
      : null
    if (!vid || !fmt) throw new Error("ssvid missing vid/k")

    const convertBody = new URLSearchParams()
    convertBody.set("hl", "en")
    convertBody.set("vid", vid)
    convertBody.set("k", fmt.k)
    console.log("SSVID convert body:", convertBody.toString())

    const convertUrl = "https://ssvid.net/api/ajax/convert?hl=en"
    console.log("POST", convertUrl)
    const convertRes = await fetch(convertUrl, {
      method: "POST",
      headers,
      body: convertBody.toString(),
    })
    console.log("Convert status:", convertRes.status, convertRes.statusText)
    if (!convertRes.ok)
      throw new Error(`ssvid convert failed ${convertRes.status}`)
    const convertJson: any = await convertRes.json()
    console.log("Convert JSON keys:", Object.keys(convertJson || {}))
    if (convertJson?.status !== "ok")
      throw new Error(convertJson?.mess || "ssvid convert error")
    const dlink: string | undefined = convertJson?.dlink
    console.log("Download link:", dlink)
    if (!dlink) throw new Error("ssvid missing dlink")

    console.log("GET", dlink)
    const fileRes = await fetch(dlink)
    console.log(
      "File status:",
      fileRes.status,
      fileRes.statusText,
      "ctype:",
      fileRes.headers.get("content-type"),
      "clen:",
      fileRes.headers.get("content-length")
    )
    if (!fileRes.ok) throw new Error(`audio fetch failed ${fileRes.status}`)
    const arrayBuffer = await fileRes.arrayBuffer()
    const contentType =
      fileRes.headers.get("content-type") || fmt.contentType
    const ext = preferredExt || fmt.ext
    console.log("Uploading with contentType/ext:", contentType, ext)
    return await uploadToSupabase(arrayBuffer, contentType, ext)
  } catch (err: any) {
    console.error("YouTube download failed", err)
    return NextResponse.json(
      { error: err?.message || "Download failed" },
      { status: 500 }
    )
  }
}
