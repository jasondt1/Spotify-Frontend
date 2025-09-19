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

import { Input } from "./ui/input"

export async function AdminHeader() {
  const user = await getCurrentUser()
  const displayName = user?.name || null

  return (
    <header className="bg-black sticky top-0 z-40 w-full border-b">
      <div className="container flex py-2.5 items-center space-x-4 sm:justify-between">
        <FaSpotify size={36} className="text-white" />

        <div className="flex gap-2 py-3">
          <nav className="flex items-center gap-8">
            <Link
              href="/admin/genres/"
              className="text-neutral-300 hover:text-white font-medium"
            >
              Genres
            </Link>
            <Link
              href="/admin/artists/"
              className="text-neutral-300 hover:text-white font-medium"
            >
              Artists
            </Link>
          </nav>
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
