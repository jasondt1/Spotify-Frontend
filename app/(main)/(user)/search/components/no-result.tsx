export default function NoResult({
  label,
  query,
}: {
  label: string
  query: string
}) {
  return (
    <div className="rounded-md bg-neutral-800 p-6 text-sm text-neutral-300 mt-6 cursor-default">
      {label} not found for "{query}".
    </div>
  )
}
