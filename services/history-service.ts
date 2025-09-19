import { HistoryResponseDto, PlayCountResponseDto } from "@/dto/history"
import { BaseService } from "@/services/base-service"

class HistoryService extends BaseService {
  async recordPlay(trackId: string, token?: string): Promise<PlayCountResponseDto> {
    const { data } = await this.post<PlayCountResponseDto>(
      `/api/history/tracks/${trackId}/play`,
      null,
      token
    )
    return data
  }

  async getTrackPlays(trackId: string, token?: string): Promise<PlayCountResponseDto> {
    const { data } = await super.get<PlayCountResponseDto>(
      `/api/history/tracks/${trackId}/plays`,
      token
    )
    return data
  }

  async getMyTrackPlays(trackId: string, token?: string): Promise<PlayCountResponseDto> {
    const { data } = await super.get<PlayCountResponseDto>(
      `/api/history/tracks/${trackId}/plays/me`,
      token
    )
    return data
  }

  async getMyHistory(page = 0, size = 20, token?: string): Promise<HistoryResponseDto[]> {
    const { data } = await super.get<HistoryResponseDto[]>("/api/history/me", token, {
      params: { page, size },
    })
    return data
  }
}

export const historyService = new HistoryService()
