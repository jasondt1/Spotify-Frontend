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

