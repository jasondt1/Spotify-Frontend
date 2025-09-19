import type { TrackResponseDto } from "@/dto/artist"

export interface NowPlayingResponseDto {
  track: TrackResponseDto
  startedAt: string
  positionSec: number
  artistId?: string
  albumId?: string
  playlistId?: string
}

export interface NowPlayingStartRequestDto {
  artistId?: string
  albumId?: string
  playlistId?: string
}
