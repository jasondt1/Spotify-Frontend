"use client"

import { useEffect, useRef, useState } from "react"

interface HoverWrapperProps {
  children: React.ReactNode
  className?: string
}

export function HoverWrapper({ children, className }: HoverWrapperProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`${className} overflow-y-auto rounded-xl bg-neutral-900 h-[calc(100vh-150px)] pb-2 custom-scrollbar ${
        hovered ? "scrollbar-hover" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  )
}
