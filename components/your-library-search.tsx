"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"

type Props = {
  searchQuery: string
  setSearchQuery: (q: string) => void
  isExpanded: boolean
  setIsExpanded: (v: boolean) => void
}

export default function YourLibrarySearch({
  searchQuery,
  setSearchQuery,
  isExpanded,
  setIsExpanded,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setIsExpanded])

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [isExpanded])

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center min-h-8 ml-2 mb-4 mt-2"
    >
      <div
        className={`relative flex items-center transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "w-52 opacity-100" : "w-8 opacity-100"
        }`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white z-10 flex-shrink-0"
        >
          <Search size={16} />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search in Your Library"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full h-8 pl-8 pr-8 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder:text-neutral-400 text-sm transition-all duration-300 ease-in-out outline-none  ${
            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {searchQuery && isExpanded && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-opacity duration-200"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
