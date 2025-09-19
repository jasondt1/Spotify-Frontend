import type { TrackResponseDto } from "@/dto/artist"
import type {
  NowPlayingResponseDto,
  NowPlayingStartRequestDto,
} from "@/dto/now-playing"
import { BaseService } from "@/services/base-service"
class NowPlayingService extends BaseService {
  async fetch(token?: string): Promise<NowPlayingResponseDto | null> {
    try {
      const { data } = await super.get<NowPlayingResponseDto>("/api/now-playing/me", token, {
        validateStatus: (status) => status === 200 || status === 204,
      })
      return data ?? null
    } catch (err: any) {
      throw err
    }
  }

  async set(
    trackId: string,
    source?: NowPlayingStartRequestDto,
    token?: string
  ): Promise<NowPlayingResponseDto> {
    try {
      const { data } = await this.post<NowPlayingResponseDto>(
        `/api/now-playing/tracks/${trackId}`,
        source ?? null,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async stop(token?: string): Promise<void> {
    try {
      await super.delete<void>("/api/now-playing/me", token)
    } catch (err: any) {
      throw err
    }
  }

  async updatePosition(sec: number, token?: string): Promise<NowPlayingResponseDto> {
    try {
      const { data } = await this.patch<NowPlayingResponseDto>(
        "/api/now-playing/me/position",
        null,
        token,
        { params: { sec } }
      )
      return data
    } catch (err: any) {
      throw err
    }
  }
}

export const nowPlayingService = new NowPlayingService()
