export function formatDuration(seconds?: number) {
  if (!seconds && seconds !== 0) return "-"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

export function formatTotalDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} hr ${minutes} min`
  } else if (minutes > 0) {
    return `${minutes} min ${seconds} sec`
  }
  return `${seconds} sec`
}

export function formatNumber(num?: number): string {
  if (num === undefined || num === null) return "-"

  const str = Math.floor(num).toString()
  let result = ""
  let count = 0

  for (let i = str.length - 1; i >= 0; i--) {
    result = str[i] + result
    count++
    if (count % 3 === 0 && i !== 0) {
      result = "," + result
    }
  }

  return result
}
