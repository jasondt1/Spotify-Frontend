"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { HoverWrapper } from "@/components/hover-wrapper"
import YourLibrary from "@/components/your-library"
import YourQueue from "@/components/your-queue"

interface ResizableMainWrapperProps {
  children: React.ReactNode
  token?: string
}

export default function ResizableMainWrapper({
  children,
  token,
}: ResizableMainWrapperProps) {
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(22.5)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(22.5)
  const [isDraggingLeft, setIsDraggingLeft] = useState(false)
  const [isDraggingRight, setIsDraggingRight] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hasResetLeft, setHasResetLeft] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getResponsiveWidths = useCallback(() => {
    if (!containerRef.current || !token) return { left: 0, right: 0, main: 100 }
    const minLeftPx = 75
    const minRightPx = 250
    if (containerWidth < minLeftPx + minRightPx + 400) {
      return { left: 0, right: 0, main: 100 }
    }
    const leftDesiredPx = (containerWidth * leftSidebarWidth) / 100
    const rightDesiredPx = (containerWidth * rightSidebarWidth) / 100
    const leftActualPx = Math.max(minLeftPx, leftDesiredPx)
    const rightActualPx = Math.max(minRightPx, rightDesiredPx)
    const leftActual = (leftActualPx / containerWidth) * 100
    const rightActual = (rightActualPx / containerWidth) * 100
    const mainActual = 100 - leftActual - rightActual
    if (mainActual < 20) {
      return { left: 0, right: 0, main: 100 }
    }
    return { left: leftActual, right: rightActual, main: mainActual }
  }, [leftSidebarWidth, rightSidebarWidth, token, containerWidth])

  const normalizeLeftWidth = useCallback(
    (newWidthPercent: number, containerWidth: number) => {
      const minLeftPx = 75
      const snapThresholdPx = 250
      const minLeftPercent = (minLeftPx / containerWidth) * 100
      if ((newWidthPercent / 100) * containerWidth < snapThresholdPx) {
        return minLeftPercent
      }
      return Math.max(minLeftPercent, Math.min(22.5, newWidthPercent))
    },
    []
  )

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width
        setContainerWidth(width)
        if (width > 1280) {
          if (!hasResetLeft) {
            setLeftSidebarWidth(22.5)
            setHasResetLeft(true)
          }
        } else {
          setHasResetLeft(false)
          const currentPx = (leftSidebarWidth / 100) * width
          const newPercent = (currentPx / width) * 100
          setLeftSidebarWidth(normalizeLeftWidth(newPercent, width))
        }
      }
    }
    const resizeObserver = new ResizeObserver(updateContainerWidth)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
      updateContainerWidth()
    }
    window.addEventListener("resize", updateContainerWidth)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateContainerWidth)
    }
  }, [leftSidebarWidth, normalizeLeftWidth, hasResetLeft])

  const handleLeftMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDraggingLeft(true)
    e.preventDefault()
  }, [])

  const handleRightMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDraggingRight(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const mouseX = e.clientX - containerRect.left
      if (isDraggingLeft) {
        const newWidthPercent = (mouseX / containerWidth) * 100
        setLeftSidebarWidth(normalizeLeftWidth(newWidthPercent, containerWidth))
      }
      if (isDraggingRight) {
        const distanceFromRight = containerWidth - mouseX
        const newPercent = (distanceFromRight / containerWidth) * 100
        const minRightPx = 250
        const minRightPercent = (minRightPx / containerWidth) * 100
        setRightSidebarWidth(
          Math.max(minRightPercent, Math.min(22.5, newPercent))
        )
      }
    },
    [isDraggingLeft, isDraggingRight, normalizeLeftWidth]
  )

  const handleMouseUp = useCallback(() => {
    setIsDraggingLeft(false)
    setIsDraggingRight(false)
  }, [])

  useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "grabbing"
      document.body.style.userSelect = "none"
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp])

  const responsiveWidths = getResponsiveWidths()

  if (!token) {
    return (
      <div className="flex gap-2 px-2 font-medium">
        <HoverWrapper id="main-content" className="w-full" guest={true}>
          {children}
        </HoverWrapper>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex gap-2 px-2 font-medium relative">
      {responsiveWidths.left > 0 && (
        <div
          className="sidebar"
          style={{
            width: `${responsiveWidths.left}%`,
            flexShrink: 0,
          }}
        >
          <YourLibrary
            widthPx={(responsiveWidths.left / 100) * containerWidth}
          />
        </div>
      )}
      {responsiveWidths.left > 0 && (
        <div
          className={`w-1 cursor-grab hover:bg-gray-600 transition-colors absolute z-10 h-full ${
            isDraggingLeft
              ? "opacity-100 bg-gray-500"
              : "opacity-0 hover:opacity-100"
          }`}
          style={{
            left: `${responsiveWidths.left}%`,
            width: "6px",
            marginLeft: "0px",
          }}
          onMouseDown={handleLeftMouseDown}
        >
          <div className="w-full h-full bg-gray-500 rounded-full" />
        </div>
      )}
      <HoverWrapper
        id="main-content"
        className="flex-1"
        style={{
          width: `${responsiveWidths.main}%`,
        }}
        guest={false}
      >
        {children}
      </HoverWrapper>
      {responsiveWidths.right > 0 && (
        <div
          className={`w-1 cursor-grab hover:bg-gray-600 transition-colors absolute z-10 h-full ${
            isDraggingRight
              ? "opacity-100 bg-gray-500"
              : "opacity-0 hover:opacity-100"
          }`}
          style={{
            right: `${responsiveWidths.right}%`,
            width: "6px",
            marginRight: "0px",
          }}
          onMouseDown={handleRightMouseDown}
        >
          <div className="w-full h-full bg-gray-500 rounded-full" />
        </div>
      )}
      {responsiveWidths.right > 0 && (
        <div
          className="right-scroll-group sidebar"
          style={{
            width: `${responsiveWidths.right}%`,
            flexShrink: 0,
          }}
        >
          <YourQueue />
        </div>
      )}
    </div>
  )
}
