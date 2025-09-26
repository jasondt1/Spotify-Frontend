"use client"

import { forwardRef, useState } from "react"

interface HoverWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  guest?: boolean
  style?: React.CSSProperties
}

export const HoverWrapper = forwardRef<HTMLDivElement, HoverWrapperProps>(
  ({ children, className, id, guest = false, style }, ref) => {
    const [hovered, setHovered] = useState(false)

    return (
      <div
        id={id}
        ref={ref}
        className={`${className} relative overflow-y-auto rounded-xl bg-neutral-900 ${
          guest ? "h-[calc(100vh-159px)]" : "h-[calc(100vh-150px)]"
        } pb-2 custom-scrollbar ${hovered ? "scrollbar-hover" : ""}`}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        tabIndex={0}
      >
        {children}
      </div>
    )
  }
)

HoverWrapper.displayName = "HoverWrapper"
