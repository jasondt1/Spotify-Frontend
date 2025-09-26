import Link from "next/link"
import { Search } from "lucide-react"
import { CgProfile } from "react-icons/cg"
import { CiGlobe } from "react-icons/ci"
import { FaHome } from "react-icons/fa"
import { FaSpotify } from "react-icons/fa6"
import { MdOutlineLogout } from "react-icons/md"
import { PiGear } from "react-icons/pi"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getCurrentUser } from "@/app/(main)/actions/auth"

import { SearchInput } from "./search-input"

export async function SiteHeader() {
  const user = await getCurrentUser()
  const displayName = user?.name || null

  return (
    <header className="bg-black sticky top-0 z-40 w-full">
      <div className="flex -ml-2 sm:ml-0 pl-0 sm:pl-7 p-2.5 items-center space-x-4 sm:justify-between">
        <div className="hidden sm:flex">
          <FaSpotify size={36} className="text-white" />
        </div>

        <div className="flex gap-2 w-full justify-center">
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="hidden sm:flex rounded-full w-12 h-12 font-extrabold bg-neutral-900 [&_svg]:!size-5 border-none"
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

          <div className="relative w-full sm:max-w-max">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={22}
            />
            <SearchInput />
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Link
                  href="/search"
                  className="absolute right-5 top-1/2 -translate-y-1/2 border-l border-neutral-500 pl-2 cursor-default"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full outline-none focus:ring-2 focus:ring-neutral-600"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profilePicture ?? ""}
                        alt={displayName ?? "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-neutral-800 text-neutral-200">
                        {(displayName ?? "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link href={`/user/${user!.userId!}`}>
                      <CgProfile />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account-settings">
                      <PiGear />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/logout">
                      <MdOutlineLogout />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          ) : (
            <nav className="flex items-center space-x-1 text-sm gap-2">
              <Link
                href="/sign-up"
                className="font-semibold text-neutral-300 hover:text-white min-w-14"
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
