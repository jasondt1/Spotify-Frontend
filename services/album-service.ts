import type { AlbumRequestDto, AlbumResponseDto } from "@/dto/artist"
import { BaseService } from "@/services/base-service"

class AlbumService extends BaseService {
  async create(dto: AlbumRequestDto, token?: string): Promise<AlbumResponseDto> {
    const { data } = await this.post<AlbumResponseDto>("/api/albums", dto, token)
    return data
  }
  async update(id: string, dto: AlbumRequestDto, token?: string): Promise<AlbumResponseDto> {
    const { data } = await this.put<AlbumResponseDto>(`/api/albums/${id}`, dto, token)
    return data
  }
  async remove(id: string, token?: string): Promise<void> {
    await super.delete<void>(`/api/albums/${id}`, token)
  }
  async getById(id: string, token?: string): Promise<AlbumResponseDto> {
    const { data } = await super.get<AlbumResponseDto>(`/api/albums/${id}`, token)
    return data
  }
}

export const albumService = new AlbumService()
