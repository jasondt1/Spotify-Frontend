import { AlbumResponseDto, ArtistSimpleDto, TrackResponseDto } from "./artist"
import { PlaylistResponseDto } from "./playlist"

export interface TopSearchResultDto {
  type: "artist" | "album" | "track" | "playlist"
  artist?: ArtistSimpleDto
  album?: AlbumResponseDto
  track?: TrackResponseDto
  playlist?: PlaylistResponseDto
}

export interface SearchResponseDto {
  top?: TopSearchResultDto
  artists: ArtistSimpleDto[]
  albums: AlbumResponseDto[]
  tracks: TrackResponseDto[]
  playlists: PlaylistResponseDto[]
}
