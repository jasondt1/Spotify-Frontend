"use client"

interface YourQueueTabsProps {
  tab: "queue" | "history"
  setTab: (tab: "queue" | "history") => void
}

export default function YourQueueTabs({ tab, setTab }: YourQueueTabsProps) {
  return (
    <div className="flex gap-6 border-b border-transparent px-3">
      <button
        onClick={() => setTab("queue")}
        className={`relative pb-2 font-semibold transition-colors ${
          tab === "queue" ? "text-white" : "text-neutral-400 hover:text-white"
        }`}
      >
        Queue
        {tab === "queue" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full" />
        )}
      </button>

      <button
        onClick={() => setTab("history")}
        className={`relative pb-2 font-semibold transition-colors ${
          tab === "history" ? "text-white" : "text-neutral-400 hover:text-white"
        }`}
      >
        Recently Played
        {tab === "history" && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full" />
        )}
      </button>
    </div>
  )
}
