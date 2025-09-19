import type {
  ArtistDetailsResponseDto,
  ArtistRequestDto,
  ArtistResponseDto,
  TopTrackDto,
} from "@/dto/artist"
import { BaseService } from "@/services/base-service"

class ArtistService extends BaseService {
  async create(
    dto: ArtistRequestDto,
    token?: string
  ): Promise<ArtistResponseDto> {
    const { data } = await this.post<ArtistResponseDto>(
      "/api/artists",
      dto,
      token
    )
    return data
  }
  async getAll(token?: string): Promise<ArtistResponseDto[]> {
    const { data } = await super.get<ArtistResponseDto[]>("/api/artists", token)
    return data
  }
  async getById(id: string, token?: string): Promise<ArtistResponseDto> {
    const { data } = await super.get<ArtistResponseDto>(
      `/api/artists/${id}`,
      token
    )
    return data
  }
  async remove(id: string, token?: string): Promise<void> {
    await super.delete<void>(`/api/artists/${id}`, token)
  }
  async update(
    id: string,
    dto: ArtistRequestDto,
    token?: string
  ): Promise<ArtistResponseDto> {
    const { data } = await this.put<ArtistResponseDto>(
      `/api/artists/${id}`,
      dto,
      token
    )
    return data
  }
  async getDetails(
    id: string,
    limit = 5,
    token?: string
  ): Promise<ArtistDetailsResponseDto> {
    const { data } = await super.get<ArtistDetailsResponseDto>(
      `/api/artists/${id}/details`,
      token,
      { params: { limit } }
    )
    return data
  }
}

export const artistService = new ArtistService()
