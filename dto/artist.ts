import type { GenreResponseDto } from "@/dto/genre"

export interface ArtistRequestDto {
  name: string
  genreId: string
  image?: string
  coverImage?: string
}

export interface TrackRequestDto {
  title: string
  duration: number
  audio: string
  albumId: string
  artistIds?: string[]
  lyrics?: LyricsLine[]
}

export interface TrackResponseDto {
  id: string
  title: string
  duration: number
  audio: string
  artists?: ArtistSimpleDto[]
  album?: AlbumResponseDto
  lyrics?: LyricsLine[]
  createdAt: string
  updatedAt: string
}

export interface LyricsLine {
  timestamp: number
  text: string
}

export interface AlbumRequestDto {
  title: string
  artistId: string
  image?: string
  releaseDate?: string
}

export interface AlbumResponseDto {
  id: string
  title: string
  releaseDate: string
  tracks: TrackResponseDto[]
  image?: string
  createdAt: string
  updatedAt: string
  artist?: ArtistResponseDto
}

export interface ArtistResponseDto {
  id: string
  name: string
  genre: GenreResponseDto
  albums?: AlbumResponseDto[]
  tracks?: TrackResponseDto[]
  image?: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export interface ArtistSimpleDto {
  id: string
  name: string
  image?: string
  coverImage?: string
}

export interface TopTrackDto {
  track: TrackResponseDto
  playCount: number
}

export interface TopArtistDto {
  artist: ArtistResponseDto
  playCount: number
}

export interface ArtistDetailsResponseDto {
  artist: ArtistResponseDto
  topTracks: TopTrackDto[]
  monthlyListeners: number
}

export type TrackWithPlayCountResponseDto = {
  track: TrackResponseDto
  playCount: number
}
