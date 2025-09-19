import getColors from "get-image-colors"
import sharp from "sharp"

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return [h, s, l]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function strengthenColor(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  let [h, s, l] = rgbToHsl(r, g, b)
  s = Math.min(1, s * 1.7)
  if (l < 0.4) l = 0.45
  return hslToRgb(h, s, l)
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === 0) return 0
  return (max - min) / max
}

const basicHues = {
  red: [0, 1],
  orange: [0.08],
  yellow: [0.16],
  green: [0.33],
  blue: [0.66],
  purple: [0.83],
}

function hueBasicScore(h: number): number {
  let maxScore = 0
  for (const key in basicHues) {
    const centers = basicHues[key as keyof typeof basicHues]
    for (const c of centers) {
      let d = Math.abs(h - c)
      if (d > 0.5) d = 1 - d
      const score = 1 - d * 3
      if (score > maxScore) maxScore = score
    }
  }
  return Math.max(0, maxScore)
}

async function fetchAsBuffer(urlOrPath: string): Promise<Buffer> {
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    const res = await fetch(urlOrPath)
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`)
    return Buffer.from(await res.arrayBuffer())
  }
  return sharp(urlOrPath).toBuffer()
}

export async function extractGradient(imagePathOrUrl: string): Promise<string> {
  try {
    const inputBuffer = await fetchAsBuffer(imagePathOrUrl)
    const pngBuffer = await sharp(inputBuffer).png().toBuffer()
    const colors = await getColors(pngBuffer, "image/png")

    const colorStats = new Map<string, number>()

    const vibrantColor = colors
      .map((c) => {
        const [r, g, b] = c.rgb()
        const [h, s, l] = rgbToHsl(r, g, b)
        const key = `${Math.round((h * 360) / 10) * 10}`
        colorStats.set(key, (colorStats.get(key) || 0) + 1)
        return {
          rgb: [r, g, b] as [number, number, number],
          sat: s,
          lum: l,
          basic: hueBasicScore(h),
          hueKey: key,
        }
      })
      .filter((c) => c.lum > 0.15 && c.lum < 0.7)
      .sort((a, b) => {
        const freqA = colorStats.get(a.hueKey) || 1
        const freqB = colorStats.get(b.hueKey) || 1
        const scoreA = a.sat * 0.4 + a.basic * 0.3 + Math.log(freqA + 1) * 0.3
        const scoreB = b.sat * 0.4 + b.basic * 0.3 + Math.log(freqB + 1) * 0.3
        return scoreB - scoreA
      })[0]

    const [r, g, b] = vibrantColor
      ? strengthenColor(...vibrantColor.rgb)
      : [34, 51, 55]

    return `linear-gradient(to bottom, rgb(${r},${g},${b}), #171717)`
  } catch (err) {
    console.error("Color extraction failed:", err)
    return "linear-gradient(to bottom, #223337, #171717)"
  }
}
