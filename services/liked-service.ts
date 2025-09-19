import type { TrackResponseDto } from "@/dto/artist"
import { BaseService } from "@/services/base-service"
class LikedService extends BaseService {
  async like(trackId: string, token?: string): Promise<void> {
    await this.post<void>(`/api/likes/tracks/${trackId}`, null, token)
  }

  async unlike(trackId: string, token?: string): Promise<void> {
    await super.delete<void>(`/api/likes/tracks/${trackId}`, token)
  }

  async isLiked(trackId: string, token?: string): Promise<boolean> {
    const { data } = await super.get<{ liked: boolean }>(
      `/api/likes/tracks/${trackId}`,
      token
    )
    return data.liked
  }

  async getAll(token?: string): Promise<TrackResponseDto[]> {
    const { data } = await super.get<TrackResponseDto[]>("/api/likes/tracks", token)
    return data
  }
}

export const likedService = new LikedService()
