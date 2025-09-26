export default function SectionTitle({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  const baseClass = "text-2xl font-bold text-white ml-4 inline-block"
  const interactiveClass = onClick ? " hover:underline cursor-pointer" : ""
  return (
    <h2 className={baseClass + interactiveClass} onClick={onClick}>
      {label}
    </h2>
  )
}
