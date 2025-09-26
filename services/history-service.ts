import { AlbumResponseDto, TopArtistDto, TopTrackDto } from "@/dto/artist"
import { HistoryResponseDto, PlayCountResponseDto } from "@/dto/history"
import { BaseService } from "@/services/base-service"

class HistoryService extends BaseService {
  async recordPlay(
    trackId: string,
    token?: string
  ): Promise<PlayCountResponseDto> {
    const { data } = await this.post<PlayCountResponseDto>(
      `/api/history/tracks/${trackId}/play`,
      null,
      token
    )
    return data
  }

  async getTrackPlays(
    trackId: string,
    token?: string
  ): Promise<PlayCountResponseDto> {
    const { data } = await super.get<PlayCountResponseDto>(
      `/api/history/tracks/${trackId}/plays`,
      token
    )
    return data
  }

  async getMyTrackPlays(
    trackId: string,
    token?: string
  ): Promise<PlayCountResponseDto> {
    const { data } = await super.get<PlayCountResponseDto>(
      `/api/history/tracks/${trackId}/plays/me`,
      token
    )
    return data
  }

  async getMyHistory(
    page = 0,
    size = 50,
    token?: string
  ): Promise<HistoryResponseDto[]> {
    const { data } = await super.get<HistoryResponseDto[]>(
      "/api/history/me",
      token,
      {
        params: { page, size },
      }
    )
    return data
  }
  async getUserTopTracks(
    userId: string,
    token?: string
  ): Promise<TopTrackDto[]> {
    const { data } = await super.get<TopTrackDto[]>(
      `/api/history/users/${userId}/top-tracks`,
      token
    )
    return data
  }

  async getUserTopArtists(
    userId: string,
    token?: string
  ): Promise<TopArtistDto[]> {
    const { data } = await super.get<TopArtistDto[]>(
      `/api/history/users/${userId}/top-artists`,
      token
    )
    return data
  }
  async getTopTracksAllTime(
    limit = 20,
    token?: string
  ): Promise<TopTrackDto[]> {
    const { data } = await super.get<TopTrackDto[]>(
      "/api/history/top-tracks",
      token,
      { params: { limit } }
    )
    return data
  }

  async getTopArtistsAllTime(
    limit = 20,
    token?: string
  ): Promise<TopArtistDto[]> {
    const { data } = await super.get<TopArtistDto[]>(
      "/api/history/top-artists",
      token,
      { params: { limit } }
    )
    return data
  }

  async getTopAlbumsAllTime(
    limit = 20,
    token?: string
  ): Promise<AlbumResponseDto[]> {
    const { data } = await super.get<AlbumResponseDto[]>(
      "/api/history/top-albums",
      token,
      { params: { limit } }
    )
    return data
  }
}

export const historyService = new HistoryService()
