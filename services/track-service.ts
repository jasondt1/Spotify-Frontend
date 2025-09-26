import type {
  TrackRequestDto,
  TrackResponseDto,
  TrackWithPlayCountResponseDto,
} from "@/dto/artist"
import { BaseService } from "@/services/base-service"

class TrackService extends BaseService {
  async create(
    dto: TrackRequestDto,
    token?: string
  ): Promise<TrackResponseDto> {
    try {
      const { data } = await this.post<TrackResponseDto>(
        "/api/tracks",
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
    dto: Partial<TrackRequestDto>,
    token?: string
  ): Promise<TrackResponseDto> {
    try {
      const { data } = await this.put<TrackResponseDto>(
        `/api/tracks/${id}`,
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
      await super.delete<void>(`/api/tracks/${id}`, token)
    } catch (err: any) {
      throw err
    }
  }

  async getById(id: string, token?: string): Promise<TrackResponseDto> {
    try {
      const { data } = await this.get<TrackResponseDto>(
        `/api/tracks/${id}`,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }
  async getWithPlays(
    id: string,
    token?: string
  ): Promise<TrackWithPlayCountResponseDto> {
    const { data } = await this.get<TrackWithPlayCountResponseDto>(
      `/api/tracks/${id}/with-plays`,
      token
    )
    return data
  }
}

export const trackService = new TrackService()
