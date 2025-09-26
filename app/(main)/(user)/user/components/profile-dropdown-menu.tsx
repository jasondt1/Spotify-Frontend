"use client"

import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { BsThreeDots } from "react-icons/bs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EditProfile } from "./edit-profile"

interface ProfileDropdownMenuProps {
  userId: string
}

export function ProfileDropdownMenu({ userId }: ProfileDropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const { currentUser } = useUser()

  if (currentUser?.userId !== userId) return null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-300 hover:text-white hover:scale-110 transition-transform">
          <BsThreeDots size={30} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="start">
        <EditProfile closeDropdown={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
