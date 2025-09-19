"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePlayer } from "@/contexts/player-context"
import { useUser } from "@/contexts/user-context"
import { playlistService } from "@/services/playlist-service"
import { HiMagnifyingGlass, HiOutlinePlus, HiXMark } from "react-icons/hi2"
import { IoMdMusicalNotes } from "react-icons/io"
import { MdVolumeUp } from "react-icons/md"

import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

import { HoverWrapper } from "./hover-wrapper"
import { Button } from "./ui/button"
import YourLibrarySearch from "./your-library-search"

export default function YourLibrary() {
  const { libraries, playlists, fetchLibraries, fetchPlaylists } = useUser()
  const { nowPlaying, isPlaying } = usePlayer()
  const router = useRouter()

  const [selectedType, setSelectedType] = useState<"playlist" | "album" | null>(
    null
  )
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleType = (type: "playlist" | "album") => {
    setSelectedType((prev) => (prev === type ? null : type))
  }

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      setSearchQuery("")
    }
  }

  const handleSearchClear = () => {
    setSearchQuery("")
  }

  const filteredLibraries = useMemo(() => {
    let filtered = libraries

    if (selectedType !== null) {
      filtered = filtered.filter((l) => l.type === selectedType)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (library) =>
          library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          library.creator.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [libraries, selectedType, searchQuery])

  const handleCreatePlaylist = async () => {
    try {
      const res = await playlistService.create({
        name: "My Playlist #" + (playlists.length + 1),
        description: "",
        image: "",
        trackIds: [],
      })
      await fetchLibraries()
      await fetchPlaylists()
      toast({ description: `Successfully created playlist.` })
      router.push("/playlist/" + res.id)
    } catch (err) {
      console.error("Failed to create playlist:", err)
    }
  }

  return (
    <HoverWrapper className="p-1.5 w-full">
      <div className="flex items-center justify-between p-2 pl-4">
        <h2 className="font-semibold">Your Library</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handleCreatePlaylist}
          >
            <HiOutlinePlus />
            Create
          </Button>
        </div>
      </div>

      <div className="px-3 py-1">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => toggleType("playlist")}
            className={
              selectedType === "playlist"
                ? "rounded-full px-4 py-1.5 text-sm font-medium bg-white text-black"
                : "rounded-full px-4 py-1.5 text-sm font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }
          >
            Playlists
          </button>
          <button
            onClick={() => toggleType("album")}
            className={
              selectedType === "album"
                ? "rounded-full px-4 py-1.5 text-sm font-medium bg-white text-black"
                : "rounded-full px-4 py-1.5 text-sm font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }
          >
            Albums
          </button>
        </div>
      </div>

      <YourLibrarySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isExpanded={isSearchExpanded}
        setIsExpanded={setIsSearchExpanded}
      />

      <div className="flex flex-col">
        {filteredLibraries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="text-white text-lg font-medium mb-2">
              {searchQuery.trim()
                ? `Couldn't find "${searchQuery}"`
                : "No items found"}
            </div>
            <div className="text-neutral-400 text-sm">
              {searchQuery.trim()
                ? "Try searching again using a different spelling or keyword."
                : selectedType === "playlist"
                ? "Your playlist is empty."
                : selectedType === "album"
                ? "Your album is empty."
                : "Your library is empty."}
            </div>
          </div>
        ) : (
          filteredLibraries.map((library, idx) => (
            <Link
              key={idx}
              href={`/${library.type}/${library.id}`}
              className="flex gap-3.5 hover:bg-white/15 p-2 py-1.5 rounded cursor-pointer"
            >
              {library.type === "playlist" ? (
                (() => {
                  const uniqueAlbums = library.tracks.reduce(
                    (acc: any[], track: any) => {
                      if (
                        track.album?.image &&
                        !acc.find((a) => a.id === track.album.id)
                      ) {
                        acc.push(track.album)
                      }
                      return acc
                    },
                    []
                  )

                  if (uniqueAlbums.length >= 4) {
                    return (
                      <div className="grid grid-cols-2 grid-rows-2 gap-0 min-w-12 h-12 rounded overflow-hidden">
                        {uniqueAlbums.slice(0, 4).map((album, i) => (
                          <img
                            key={i}
                            src={album.image}
                            alt={album.title || `Album ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ))}
                      </div>
                    )
                  }

                  return library.image ? (
                    <img
                      src={library.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : library.tracks[0]?.album?.image ? (
                    <img
                      src={library.tracks[0].album.image}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="aspect-square min-h-12 flex items-center justify-center bg-neutral-700 rounded">
                      <IoMdMusicalNotes
                        className="text-neutral-300 text-lg"
                        size={24}
                      />
                    </div>
                  )
                })()
              ) : library.image ? (
                <img
                  src={library.image}
                  alt=""
                  className="w-12 h-12 object-cover rounded"
                />
              ) : library.tracks[0]?.album?.image ? (
                <img
                  src={library.tracks[0].album.image}
                  alt=""
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="aspect-square min-h-12 flex items-center justify-center bg-neutral-700 rounded">
                  <IoMdMusicalNotes
                    className="text-neutral-300 text-lg"
                    size={24}
                  />
                </div>
              )}

              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col">
                  <div
                    className={`font-medium text-md ${
                      nowPlaying?.playlistId === library.id ||
                      nowPlaying?.albumId === library.id
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {library.name}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {library.type} • {library.creator}
                  </div>
                </div>

                {(nowPlaying?.playlistId === library.id ||
                  nowPlaying?.albumId === library.id) &&
                  isPlaying && (
                    <MdVolumeUp size={20} className="text-green-500" />
                  )}
              </div>
            </Link>
          ))
        )}
      </div>
    </HoverWrapper>
  )
}
