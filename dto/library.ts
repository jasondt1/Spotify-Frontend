import type { TrackResponseDto } from "@/dto/artist"

export interface LibraryResponseDto {
  id: string
  type: string
  name: string
  image: string
  creator: string
  tracks: TrackResponseDto[]
}
