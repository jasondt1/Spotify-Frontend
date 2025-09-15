import type { ArtistRequestDto, ArtistResponseDto } from "@/dto/artist"
import { api, authHeader } from "@/services/http"

export async function createArtist(
  dto: ArtistRequestDto,
  token?: string
): Promise<ArtistResponseDto> {
  const { data } = await api.post<ArtistResponseDto>("/api/artists", dto, {
    headers: authHeader(token),
  })
  return data
}

export async function getArtists(): Promise<ArtistResponseDto[]> {
  const { data } = await api.get<ArtistResponseDto[]>("/api/artists")
  return data
}

export async function getArtistById(id: string): Promise<ArtistResponseDto> {
  const { data } = await api.get<ArtistResponseDto>(`/api/artists/${id}`)
  return data
}

export async function deleteArtist(id: string): Promise<void> {
  await api.delete(`/api/artists/${id}`)
}

export async function updateArtist(
  id: string,
  dto: ArtistRequestDto
): Promise<ArtistResponseDto> {
  const { data } = await api.put<ArtistResponseDto>(`/api/artists/${id}`, dto)
  return data
}

export const artistService = {
  create: createArtist,
  getAll: getArtists,
  getById: getArtistById,
  delete: deleteArtist,
  update: updateArtist,
}
