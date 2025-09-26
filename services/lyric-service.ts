import { LyricsLine } from "@/dto/artist"
import { GoogleGenAI } from "@google/genai"
import axios from "axios"

import { BaseService } from "./base-service"

class LyricService extends BaseService {
  async searchGenius(artist: string, title: string) {
    const qs = `artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(
      title
    )}`

    const base =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        : ""

    const url = `${base}/api/genius?${qs}`

    try {
      const res = await axios.get(url, {
        headers: { "Cache-Control": "no-store" },
      })
      return res.data
    } catch (err: any) {
      const msg =
        err.response?.data ||
        err.response?.statusText ||
        err.message ||
        "Unknown error"
      throw new Error(
        `Failed to fetch Genius API: ${err.response?.status || ""} ${msg}`
      )
    }
  }

  async getLyrics(
    audioFile: File,
    artist: string,
    title: string
  ): Promise<LyricsLine[]> {
    const lyrics = await this.searchGenius(artist, title)
    const arrayBuffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString("base64")
    const genAI = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    })
    const contents = [
      {
        text: `ROLE: Align Genius lyrics to audio.

OUTPUT: ONLY a raw JSON array: [{"timestamp":number,"text":string}], no prose/fences. Timestamps are seconds (int/float), never "mm:ss".

TEXT (ABSOLUTE):
- Use each Genius lyric line verbatim for "text".
- Keep "?".
- Remove parentheses () inside the line and strip trailing punctuation except "?".
- Skip section headers like [Verse], [Chorus], [Bridge], and blank lines.
- Preserve order; include every remaining line exactly once.

TIMING:
- "timestamp" = onset when LEAD VOCAL starts that line (first sung syllable), not instruments/adlibs.
- Strictly increasing: t[i] < t[i+1].
- Let D = audio duration (sec). Ensure 0 ≤ t < D.
  If any t ≥ D or onset not confidently found, set t = min(D-0.25, prev+0.25).

NO EARLY SKIPS:
- Scan from start; do not miss early vocals.

Genius lyrics:
${lyrics || "N/A"}`,
      },
      {
        inlineData: {
          mimeType: audioFile.type || "audio/mp3",
          data: base64Audio,
        },
      },
    ]

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents,
      config: {
        temperature: 0.15,
        topK: 32,
        topP: 0.9,
        // maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              timestamp: { type: "number" },
              text: { type: "string" },
            },
            required: ["timestamp", "text"],
          },
        },
      },
    })
    let result: LyricsLine[] = []
    try {
      const rawText = (response as any).text || ""
      let jsonString = rawText
      const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (codeBlockMatch) jsonString = codeBlockMatch[1]
      const startIdx = jsonString.indexOf("[")
      const lastBracketIdx = jsonString.lastIndexOf("]")
      if (
        startIdx !== -1 &&
        lastBracketIdx !== -1 &&
        lastBracketIdx > startIdx
      ) {
        jsonString = jsonString.substring(startIdx, lastBracketIdx + 1)
        jsonString = jsonString
          .replace(/,(\s*[}\]])/g, "$1")
          .replace(/([^\\])\\n/g, "$1\\n")
          .trim()
        result = JSON.parse(jsonString)
      } else {
        throw new Error("No valid JSON array found")
      }
    } catch (err) {
      console.error("Failed to parse lyrics JSON:", err)
      try {
        const rawText = (response as any).text || ""
        const lines = rawText.split("\n")
        const jsonLines: string[] = []
        let inArray = false
        for (const line of lines) {
          if (line.includes("[")) inArray = true
          if (inArray) {
            jsonLines.push(line)
            if (line.includes("]")) break
          }
        }
        let reconstructed = jsonLines.join("\n")
        if (!reconstructed.includes("]")) {
          const lastComma = reconstructed.lastIndexOf(",")
          if (lastComma > -1)
            reconstructed = reconstructed.substring(0, lastComma)
          reconstructed += "\n]"
        }
        result = JSON.parse(reconstructed)
      } catch (fallbackErr) {
        console.error("All parsing attempts failed:", fallbackErr)
      }
    }
    return result
  }
}

export const lyricService = new LyricService()
