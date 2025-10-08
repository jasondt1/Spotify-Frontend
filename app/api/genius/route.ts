import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

function cleanLyrics(rawLyrics: string): string {
  if (!rawLyrics) return ""

  let cleaned = rawLyrics
    .replace(
      /^.*?(Deutsch|English|العربية|Español|Português|Русский|Russian|Italiano|ไทย|Thai|Nederlands|繁體中文|Traditional Chinese|Bahasa Indonesia|Українська|Česky|Slovenčina|Türkçe|Romanization).*?(?=\[|[가-힣])/gi,
      ""
    )
    .replace(/^.*?Lyrics\s*\[/gi, "[")
    .replace(/^\d+\s*Contributors[\s\S]*?(?=\[|\w)/gi, "")
    .replace(/^[\s\S]*?Translations[\s\S]*?(?=\[|\w)/gi, "")
    .replace(/^[\s\S]*?Read More[\s\S]*?(?=\[|\w)/gi, "")
    .replace(/^[\s\S]*?does another[\s\S]*?breakup\./gi, "")
    .replace(/^[\s\S]*?is the[\s\S]*?by[\s\S]*?(?=\[|\w)/gi, "")
    .replace(/^[\s\S]*?was teased[\s\S]*?Read More/gi, "")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .replace(/^\s+/gm, "")
    .trim()

  const lines = cleaned
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.match(/^\[.*?\]$/))
    .filter((line) => !line.match(/^\(.*?\)$/))
    .filter(
      (line) =>
        !line.match(
          /^(Deutsch|English|العربية|Español|Português|Русский|Russian|Italiano|ไทى|Thai|Nederlands|繁體中文|Traditional Chinese|Bahasa Indonesia|Українська|Česky|Slovenčina|Türkçe|Romanization)$/i
        )
    )

  return lines.join("\n")
}

function scoreSearchResult(
  hit: any,
  searchArtist: string,
  searchTitle: string
): number {
  let score = 0
  const result = hit.result
  const artistName = result.primary_artist?.name?.toLowerCase() || ""
  const songTitle = result.title?.toLowerCase() || ""
  const fullTitle = result.full_title?.toLowerCase() || ""

  const searchArtistLower = searchArtist.toLowerCase()
  const searchTitleLower = searchTitle.toLowerCase()

  // artist match
  if (artistName === searchArtistLower) score += 100
  else if (
    artistName.includes(searchArtistLower) ||
    searchArtistLower.includes(artistName)
  )
    score += 50

  // title match
  if (songTitle === searchTitleLower || songTitle.includes(searchTitleLower))
    score += 80

  // translation filter
  const translationKeywords = [
    "translation",
    "tradução",
    "traducción",
    "traduzione",
    "traduction",
    "перевод",
    "çeviri",
    "переклад",
    "الترجمة",
    "翻译",
    "번역",
    "romanized",
    "romanization",
  ]
  if (
    translationKeywords.some(
      (kw) => fullTitle.includes(kw) || artistName.includes(kw)
    )
  )
    score -= 200

  const translationServices = [
    "genius translations",
    "genius romanizations",
    "genius english translations",
    "genius arabic translations",
    "genius traducciones",
    "genius traduzioni",
    "genius russian translations",
    "genius ukrainian translations",
    "genius türkçe çeviriler",
  ]
  if (translationServices.some((svc) => artistName.includes(svc))) score -= 300

  // community activity
  if (result.pyongs_count) score += Math.min(result.pyongs_count * 2, 50)
  if (result.annotation_count)
    score += Math.min(result.annotation_count * 5, 100)

  // strong match artist+title
  if (artistName === searchArtistLower && songTitle.includes(searchTitleLower))
    score += 150

  return score
}

function findBestResult(
  hits: any[],
  searchArtist: string,
  searchTitle: string
) {
  if (!hits?.length) return null

  const scored = hits.map((hit) => ({
    hit,
    score: scoreSearchResult(hit, searchArtist, searchTitle),
  }))

  scored.sort((a, b) => b.score - a.score)

  console.log("Scored results:")
  scored.forEach((item, i) =>
    console.log(
      `${i + 1}. ${item.hit.result.full_title} - Score: ${item.score}`
    )
  )

  return scored[0]?.hit
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const artist = searchParams.get("artist")
    const title = searchParams.get("title")

    if (!artist || !title) {
      return NextResponse.json(
        { error: "Missing artist or title" },
        { status: 400 }
      )
    }

    const token = process.env.GENIUS_TOKEN
    if (!token) {
      return NextResponse.json(
        { error: "Missing GENIUS_TOKEN env var" },
        { status: 500 }
      )
    }

    const q = `${artist} ${title}`
    const { data: searchRes } = await axios.get(
      "https://api.genius.com/search",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { q, per_page: 20 },
      }
    )

    const hits = searchRes.response?.hits
    if (!hits?.length) {
      return NextResponse.json({ error: "No results found" }, { status: 404 })
    }

    const bestHit = findBestResult(hits, artist, title)
    if (!bestHit) {
      return NextResponse.json(
        { error: "No suitable results found" },
        { status: 404 }
      )
    }

    const result = bestHit.result
    console.log(
      `Selected: ${result.full_title} by ${result.primary_artist.name}`
    )

    const { data: songRes } = await axios.get(
      `https://api.genius.com/songs/${result.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const url = songRes.response.song.url
    if (!url)
      return NextResponse.json(
        { error: "No Genius URL found" },
        { status: 404 }
      )

    console.log(url)

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Referer: "https://www.google.com/",
        Connection: "keep-alive",
      },
    })

    console.log(html)

    const $ = cheerio.load(html)
    let rawLyrics = ""

    const selectors = [
      '[data-lyrics-container="true"]',
      ".lyrics",
      ".song_body-lyrics",
      '[class*="Lyrics__Container"]',
    ]

    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        elements.each((_, el) => {
          const text = $(el).html()
          if (text) {
            const withNewlines = text.replace(/<br\s*\/?>/gi, "\n")
            rawLyrics += cheerio.load(withNewlines).text() + "\n"
          }
        })
        break
      }
    }

    const cleanedLyrics = cleanLyrics(rawLyrics)
    if (!cleanedLyrics) {
      return NextResponse.json(
        { error: "Could not extract lyrics" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      lyrics: cleanedLyrics,
      song: result.title,
      artist: result.primary_artist.name,
      selectedFrom: `${hits.length} results`,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Genius request failed" },
      { status: 500 }
    )
  }
}
