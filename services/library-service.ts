import type { LibraryResponseDto } from "@/dto/library"
import { BaseService } from "@/services/base-service"

class LibraryService extends BaseService {
  async fetch(token?: string): Promise<LibraryResponseDto[]> {
    const { data } = await super.get<LibraryResponseDto[]>(
      "/api/library/me",
      token
    )
    return data
  }
  async addPlaylist(
    playlistId: string,
    token?: string
  ): Promise<LibraryResponseDto> {
    const { data } = await this.post<LibraryResponseDto>(
      `/api/library/playlists/${playlistId}`,
      null,
      token
    )
    return data
  }
  async removePlaylist(
    playlistId: string,
    token?: string
  ): Promise<LibraryResponseDto> {
    const { data } = await super.delete<LibraryResponseDto>(
      `/api/library/playlists/${playlistId}`,
      token
    )
    return data
  }
  async addAlbum(albumId: string, token?: string): Promise<LibraryResponseDto> {
    const { data } = await this.post<LibraryResponseDto>(
      `/api/library/albums/${albumId}`,
      null,
      token
    )
    return data
  }
  async removeAlbum(
    albumId: string,
    token?: string
  ): Promise<LibraryResponseDto> {
    const { data } = await super.delete<LibraryResponseDto>(
      `/api/library/albums/${albumId}`,
      token
    )
    return data
  }
}

export const libraryService = new LibraryService()
