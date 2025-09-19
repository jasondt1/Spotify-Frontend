"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"

import "nprogress/nprogress.css"

export function TopProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 50,
      trickle: true,
      speed: 100,
      minimum: 0.15,
      template: '<div class="bar" role="bar"><div class="peg"></div></div>',
    })

    const style = document.createElement("style")
    style.textContent = `
      #nprogress .bar {
        background: #22c55e !important;
        height: 3px !important;
        transition: all 200ms ease !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px #22c55e, 0 0 5px #22c55e !important;
      }
    `
    document.head.appendChild(style)

    const originalInc = NProgress.inc
    NProgress.inc = function (amount) {
      const status = NProgress.status || 0
      if (status >= 0.8) {
        return originalInc.call(this, Math.random() * 0.01)
      } else if (status >= 0.6) {
        return originalInc.call(this, Math.random() * 0.03)
      } else if (status >= 0.3) {
        return originalInc.call(this, Math.random() * 0.1)
      } else {
        return originalInc.call(this, Math.random() * 0.2)
      }
    }

    return () => {
      document.head.removeChild(style)
      NProgress.inc = originalInc
    }
  }, [])

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      NProgress.done()
      prevPathnameRef.current = pathname
    }
  }, [pathname, searchParams])

  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (
        link &&
        link.href &&
        !link.href.startsWith("mailto:") &&
        !link.href.startsWith("tel:") &&
        !link.target
      ) {
        const url = new URL(link.href)
        const currentUrl = new URL(window.location.href)

        if (
          url.pathname !== currentUrl.pathname ||
          url.search !== currentUrl.search
        ) {
          handleStart()
        }
      }
    }

    const handlePopState = () => {
      handleStart()
    }

    document.addEventListener("click", handleClick)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("click", handleClick)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  return null
}
