import type { GenreResponseDto } from "@/dto/genre"

export interface ArtistRequestDto {
  name: string
  genreId: string
  image?: string
}

export interface TrackRequestDto {
  title: string
  duration: number
  audio: string
  albumId: string
  artistIds?: string[]
}

export interface TrackResponseDto {
  id: string
  title: string
  duration: number
  audio: string
  artists?: ArtistSimpleDto[]
  createdAt: string
  updatedAt: string
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
  tracks?: TrackResponseDto[]
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
  createdAt: string
  updatedAt: string
}

export interface ArtistSimpleDto {
  id: string
  name: string
  image?: string
}
