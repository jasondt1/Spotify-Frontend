"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import type { TrackResponseDto } from "@/dto/artist"
import type { CurrentUser } from "@/dto/auth"
import { LibraryResponseDto } from "@/dto/library"
import type { PlaylistResponseDto } from "@/dto/playlist"
import { authService } from "@/services/auth-service"
import { libraryService } from "@/services/library-service"
import { likedService } from "@/services/liked-service"
import { playlistService } from "@/services/playlist-service"

type UserContextType = {
  playlists: PlaylistResponseDto[]
  fetchPlaylists: () => Promise<void>
  likedTracks: TrackResponseDto[]
  fetchLikedTracks: () => Promise<void>
  libraries: LibraryResponseDto[]
  fetchLibraries: () => Promise<void>
  currentUser: CurrentUser | null
  fetchCurrentUser: () => Promise<void>
  resetAll: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  initialPlaylists,
  initialLikedTracks,
  initialLibraries,
}: {
  children: React.ReactNode
  initialPlaylists?: PlaylistResponseDto[]
  initialLikedTracks?: TrackResponseDto[]
  initialLibraries?: LibraryResponseDto[]
}) {
  const [playlists, setPlaylists] = useState<PlaylistResponseDto[]>(
    initialPlaylists ?? []
  )
  const [likedTracks, setLikedTracks] = useState<TrackResponseDto[]>(
    initialLikedTracks ?? []
  )
  const [libraries, setLibraries] = useState<LibraryResponseDto[]>(
    initialLibraries ?? []
  )
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const fetchPlaylists = async () => {
    try {
      const res = await playlistService.getMine()
      setPlaylists(res)
    } catch (err) {
      console.error("Failed to load playlists", err)
    }
  }

  const fetchLikedTracks = async () => {
    try {
      const res = await likedService.getAll()
      setLikedTracks(res)
    } catch (err) {
      console.error("Failed to load liked tracks", err)
    }
  }

  const fetchLibraries = async () => {
    try {
      const res = await libraryService.fetch()
      setLibraries(res)
    } catch (err) {
      console.error("Failed to load libraries", err)
    }
  }

  const fetchCurrentUser = async () => {
    try {
      const res = await authService.me()
      setCurrentUser(res)
    } catch (err) {
      console.error("Failed to load current user", err)
    }
  }

  const resetAll = () => {
    try {
      setPlaylists([])
      setLikedTracks([])
      setLibraries([])
      setCurrentUser(null)
    } catch (e) {
      console.warn("User reset failed softly:", e)
    }
  }

  const pathname = usePathname()
  const AUTH_PATHS = new Set(["/logout"])

  useEffect(() => {
    if (AUTH_PATHS.has(pathname)) {
      resetAll()
    }
  }, [pathname])

  useEffect(() => {
    if (!initialPlaylists) fetchPlaylists()
    if (!initialLikedTracks) fetchLikedTracks()
    if (!initialLibraries) fetchLibraries()
    fetchCurrentUser()
  }, [])

  return (
    <UserContext.Provider
      value={{
        playlists,
        fetchPlaylists,
        likedTracks,
        fetchLikedTracks,
        libraries,
        fetchLibraries,
        currentUser,
        fetchCurrentUser,
        resetAll,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
