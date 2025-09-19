import Link from "next/link"
import { Search } from "lucide-react"
import { CiGlobe } from "react-icons/ci"
import { FaHome } from "react-icons/fa"
import { FaSpotify } from "react-icons/fa6"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getCurrentUser, logout } from "@/app/(main)/actions/auth"

import { SearchInput } from "./search-input"

export async function SiteHeader() {
  const user = await getCurrentUser()
  const displayName = user?.name || null

  return (
    <header className="bg-black sticky top-0 z-40 w-full">
      <div className="flex pl-7 p-2.5 items-center space-x-4 sm:justify-between">
        <FaSpotify size={36} className="text-white" />

        <div className="flex gap-2">
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={"outline"}
                size="icon"
                className="rounded-full w-12 h-12 font-extrabold bg-neutral-900 [&_svg]:!size-5 border-none"
              >
                <Link href="/">
                  <FaHome />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={22}
            />
            <SearchInput />
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="absolute right-4 top-1/2 -translate-y-1/2 border-l border-neutral-500 pl-3 cursor-default"
                >
                  <CiGlobe
                    size={24}
                    className="font-bold text-neutral-300 hover:text-white cursor-pointer"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Browse</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4">
          {displayName ? (
            <nav className="flex items-center space-x-3 text-sm gap-2">
              <span className="text-neutral-300">Hi, {displayName}</span>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-full h-10 px-4"
                >
                  Logout
                </Button>
              </form>
            </nav>
          ) : (
            <nav className="flex items-center space-x-1 text-sm gap-2">
              <Link
                href="/sign-up"
                className="font-semibold text-neutral-300 hover:text-white"
              >
                Sign Up
              </Link>
              <Button asChild className="rounded-full w-24 h-12 font-semibold">
                <Link href="/login">Login</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
