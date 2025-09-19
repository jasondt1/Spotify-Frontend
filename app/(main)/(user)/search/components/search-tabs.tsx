"use client"

import { cn } from "@/lib/utils"

const tabs = [
  { key: "all", label: "All" },
  { key: "songs", label: "Songs" },
  { key: "artists", label: "Artists" },
  { key: "playlists", label: "Playlists" },
  { key: "albums", label: "Albums" },
]

type Props = {
  activeTab: string
  onChange: (tab: string) => void
}

export function SearchTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            activeTab === tab.key
              ? "bg-white text-black"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
