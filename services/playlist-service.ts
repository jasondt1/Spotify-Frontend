import {
  PlaylistCreateDto,
  PlaylistResponseDto,
  PlaylistUpdateDto,
} from "@/dto/playlist"
import { BaseService } from "@/services/base-service"

class PlaylistService extends BaseService {
  async create(
    dto: PlaylistCreateDto,
    token?: string
  ): Promise<PlaylistResponseDto> {
    try {
      const { data } = await this.post<PlaylistResponseDto>(
        "/api/playlists",
        dto,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async update(
    id: string,
    dto: PlaylistUpdateDto,
    token?: string
  ): Promise<PlaylistResponseDto> {
    try {
      const { data } = await this.put<PlaylistResponseDto>(
        `/api/playlists/${id}`,
        dto,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async remove(id: string, token?: string): Promise<void> {
    try {
      await super.delete<void>(`/api/playlists/${id}`, token)
    } catch (err: any) {
      throw err
    }
  }

  async getById(id: string, token?: string): Promise<PlaylistResponseDto> {
    try {
      const { data } = await this.get<PlaylistResponseDto>(
        `/api/playlists/${id}`,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async getMine(token?: string): Promise<PlaylistResponseDto[]> {
    try {
      const { data } = await this.get<PlaylistResponseDto[]>(
        "/api/playlists/me",
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async addTrack(
    playlistId: string,
    trackId: string,
    token?: string
  ): Promise<PlaylistResponseDto> {
    try {
      const { data } = await this.post<PlaylistResponseDto>(
        `/api/playlists/${playlistId}/tracks/${trackId}`,
        null,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async removeTrack(
    id: string,
    trackId: string,
    token?: string
  ): Promise<void> {
    try {
      await super.delete<void>(`/api/playlists/${id}/tracks/${trackId}`, token)
    } catch (err: any) {
      throw err
    }
  }
}

export const playlistService = new PlaylistService()
