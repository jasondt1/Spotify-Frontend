import type { AlbumRequestDto, AlbumResponseDto } from "@/dto/artist"
import { api, authHeader } from "@/services/http"

export async function createAlbum(
  dto: AlbumRequestDto
): Promise<AlbumResponseDto> {
  const { data } = await api.post<AlbumResponseDto>("/api/albums", dto)
  return data
}

export async function updateAlbum(
  id: string,
  dto: AlbumRequestDto
): Promise<AlbumResponseDto> {
  const { data } = await api.put<AlbumResponseDto>(`/api/albums/${id}`, dto)
  return data
}

export async function deleteAlbum(id: string): Promise<void> {
  await api.delete(`/api/albums/${id}`)
}

export async function getAlbumById(id: string): Promise<AlbumResponseDto> {
  const { data } = await api.get<AlbumResponseDto>(`/api/albums/${id}`)
  return data
}

export const albumService = {
  create: createAlbum,
  update: updateAlbum,
  delete: deleteAlbum,
  getById: getAlbumById,
}
