import { TrackResponseDto } from "./artist"
import { UserResponseDto } from "./user"

export interface PlaylistResponseDto {
  id: string
  ownerId: string
  name: string
  description: string
  image: string
  tracks: TrackResponseDto[]
  createdAt: string
  updatedAt: string
  owner: UserResponseDto
}

export interface PlaylistCreateDto {
  name: string
  description: string
  image: string
  trackIds: string[]
}

export interface PlaylistUpdateDto {
  name?: string
  description?: string
  image?: string
}

export interface PlaylistAddTracksDto {
  trackId: string
}
