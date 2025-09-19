export function formatShortDate(input?: string | Date | null): string {
  if (!input) return "-"
  const d = typeof input === "string" ? new Date(input) : input
  if (isNaN(d.getTime())) return "-"
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export function getYear(input?: string | Date | null): string {
  if (!input) return "-"
  const d = typeof input === "string" ? new Date(input) : input
  if (isNaN(d.getTime())) return "-"
  return d.getFullYear().toString()
}

export function formatRelativeDate(input?: string | Date | null): string {
  if (!input) return "-"

  const d = typeof input === "string" ? new Date(input) : input
  if (isNaN(d.getTime())) return "-"

  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 30) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d)
  }

  if (diffDay >= 1) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
  if (diffHour >= 1) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
  if (diffMin >= 1) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
  return `${diffSec} second${diffSec !== 1 ? "s" : ""} ago`
}
