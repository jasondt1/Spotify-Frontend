import type { TrackResponseDto } from "@/dto/artist"
import { QueueItemResponseDto } from "@/dto/queue"
import { BaseService } from "@/services/base-service"
class QueueService extends BaseService {
  async addTrack(trackId: string, token?: string): Promise<void> {
    try {
      await this.post<void>(`/api/queue/tracks/${trackId}`, null, token)
    } catch (err: any) {
      throw err
    }
  }

  async addAlbum(albumId: string, token?: string): Promise<void> {
    try {
      await this.post<void>(`/api/queue/albums/${albumId}`, null, token)
    } catch (err: any) {
      throw err
    }
  }

  async addPlaylist(playlistId: string, token?: string): Promise<void> {
    try {
      await this.post<void>(`/api/queue/playlists/${playlistId}`, null, token)
    } catch (err: any) {
      throw err
    }
  }

  async fetch(token?: string): Promise<QueueItemResponseDto[]> {
    try {
      const { data } = await super.get<QueueItemResponseDto[]>("/api/queue", token)
      return data
    } catch (err: any) {
      throw err
    }
  }

  async popNext(token?: string): Promise<TrackResponseDto> {
    try {
      const { data } = await this.post<TrackResponseDto>("/api/queue/next", null, token)
      return data
    } catch (err: any) {
      throw err
    }
  }

  async clear(token?: string): Promise<void> {
    try {
      await super.delete<void>("/api/queue", token)
    } catch (err: any) {
      throw err
    }
  }

  async remove(queueItemId: string, token?: string): Promise<void> {
    await super.delete<void>(`/api/queue/${queueItemId}`, token)
  }

  async skip(index: number, token?: string): Promise<QueueItemResponseDto[]> {
    try {
      const { data } = await this.post<QueueItemResponseDto[]>(
        `/api/queue/skip/${index}`,
        null,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }
}

export const queueService = new QueueService()
