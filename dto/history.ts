import type { AlbumResponseDto, ArtistSimpleDto } from "@/dto/artist"

export interface PlayCountResponseDto {
  trackId: string
  totalPlays: number
  myPlays?: number | null
}

export interface HistoryResponseDto {
  trackId: string
  title: string
  duration: number
  audio: string
  artists: ArtistSimpleDto[]
  album: AlbumResponseDto
  createdAt: string
  updatedAt: string
  playedAt: string
}
