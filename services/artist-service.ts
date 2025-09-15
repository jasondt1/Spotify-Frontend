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

export async function getArtists(token?: string): Promise<ArtistResponseDto[]> {
  const { data } = await api.get<ArtistResponseDto[]>("/api/artists", {
    headers: authHeader(token),
  })
  return data
}

export async function getArtistById(
  id: string,
  token?: string
): Promise<ArtistResponseDto> {
  const { data } = await api.get<ArtistResponseDto>(`/api/artists/${id}`, {
    headers: authHeader(token),
  })
  return data
}

export async function deleteArtist(id: string, token?: string): Promise<void> {
  await api.delete(`/api/artists/${id}`, {
    headers: authHeader(token),
  })
}

export async function updateArtist(
  id: string,
  dto: ArtistRequestDto,
  token?: string
): Promise<ArtistResponseDto> {
  const { data } = await api.put<ArtistResponseDto>(`/api/artists/${id}`, dto, {
    headers: authHeader(token),
  })
  return data
}

export const artistService = {
  create: createArtist,
  getAll: getArtists,
  getById: getArtistById,
  delete: deleteArtist,
  update: updateArtist,
}
