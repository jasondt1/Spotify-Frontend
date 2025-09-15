import type { AlbumRequestDto, AlbumResponseDto } from "@/dto/artist"
import { api, authHeader } from "@/services/http"

export async function createAlbum(
  dto: AlbumRequestDto,
  token?: string
): Promise<AlbumResponseDto> {
  const { data } = await api.post<AlbumResponseDto>("/api/albums", dto, {
    headers: authHeader(token),
  })
  return data
}

export async function updateAlbum(
  id: string,
  dto: AlbumRequestDto,
  token?: string
): Promise<AlbumResponseDto> {
  const { data } = await api.put<AlbumResponseDto>(`/api/albums/${id}`, dto, {
    headers: authHeader(token),
  })
  return data
}

export async function deleteAlbum(id: string, token?: string): Promise<void> {
  await api.delete(`/api/albums/${id}`, {
    headers: authHeader(token),
  })
}

export async function getAlbumById(
  id: string,
  token?: string
): Promise<AlbumResponseDto> {
  const { data } = await api.get<AlbumResponseDto>(`/api/albums/${id}`, {
    headers: authHeader(token),
  })
  return data
}

export const albumService = {
  create: createAlbum,
  update: updateAlbum,
  delete: deleteAlbum,
  getById: getAlbumById,
}
