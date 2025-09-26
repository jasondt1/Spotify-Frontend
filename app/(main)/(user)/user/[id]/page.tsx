import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { TopArtistDto, TopTrackDto } from "@/dto/artist"
import { PlaylistResponseDto } from "@/dto/playlist"
import { UserResponseDto } from "@/dto/user"
import { historyService } from "@/services/history-service"
import { playlistService } from "@/services/playlist-service"
import { userService } from "@/services/user-service"

import { formatNumber } from "@/lib/format"
import { extractGradient } from "@/lib/gradient"

import { ProfileDropdownMenu } from "../components/profile-dropdown-menu"
import { ProfilePlaylists } from "../components/profile-playists"
import { TopArtists } from "../components/top-artists"
import { TopTracks } from "../components/top-tracks"

export default async function UserProfilePage({
  params,
}: {
  params: { id: string }
}) {
  let user: UserResponseDto | null = null
  let topTracks: TopTrackDto[] | null = null
  let topArtists: TopArtistDto[] | null = null
  let playlists: PlaylistResponseDto[] | null = null
  let error: string | null = null

  try {
    user = await userService.getById(params.id)
    topTracks = await historyService.getUserTopTracks(params.id)
    topArtists = await historyService.getUserTopArtists(params.id)
    playlists = await playlistService.getByUserId(params.id)
  } catch (e: any) {
    redirect("/not-found")
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">User</h1>
        <p className="text-sm text-white/60">{error}</p>
      </div>
    )
  }

  const coverImage = user?.profilePicture || undefined
  const gradient = coverImage
    ? await extractGradient(coverImage)
    : "linear-gradient(to bottom, #223337, #171717)"

  return (
    <div className="relative">
      <div
        className="absolute inset-x-0 top-0 h-[400px]"
        style={{ background: gradient }}
      />
      <div className="absolute inset-x-0 top-[17.2rem] h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

      <div className="flex flex-col relative z-10">
        <div className="header p-6 flex gap-8">
          <img
            src={user?.profilePicture || "/avatar-placeholder.png"}
            alt={user?.name || "User"}
            className="w-56 h-56 object-cover rounded-full"
          />

          <div className="flex flex-col mt-auto mb-2">
            <p className="font-semibold">Profile</p>
            <h1 className="text-6xl font-bold text-white tracking-tighter cursor-default mb-4">
              {user?.name ?? "unknown"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-6 px-6 mt-6">
          <ProfileDropdownMenu userId={user?.userId!} />
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-white ml-7 mb-4">
            Top artists this month
          </h1>{" "}
          <div className="mx-4">
            <TopArtists artists={topArtists!} limit={5} />
          </div>
          <h1 className="text-2xl font-bold text-white ml-7 my-4 mt-8">
            Top tracks this month
          </h1>
          <div className="mx-4">
            <TopTracks tracks={topTracks!} limit={5} />
          </div>
          <h1 className="text-2xl font-bold text-white ml-7 my-4 mt-8">
            Playlists
          </h1>
          <div className="mx-3">
            <ProfilePlaylists playlists={playlists!} />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const token = cookies().get("access_token")?.value
  try {
    const user = await userService.getById(params.id, token)
    return { title: user?.name ? `${user.name} | Profile` : "User Profile" }
  } catch {
    return { title: "User Profile" }
  }
}
