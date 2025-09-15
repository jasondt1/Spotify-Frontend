import type { TrackRequestDto, TrackResponseDto } from "@/dto/artist"
import { api, authHeader } from "@/services/http"

export async function createTrack(
  dto: TrackRequestDto
): Promise<TrackResponseDto> {
  const { data } = await api.post<TrackResponseDto>("/api/tracks", dto)
  return data
}

export async function updateTrack(
  id: string,
  dto: TrackRequestDto
): Promise<TrackResponseDto> {
  const { data } = await api.put<TrackResponseDto>(`/api/tracks/${id}`, dto)
  return data
}

export async function deleteTrack(id: string): Promise<void> {
  await api.delete(`/api/tracks/${id}`)
}

export async function getTrackById(id: string): Promise<TrackResponseDto> {
  const { data } = await api.get<TrackResponseDto>(`/api/tracks/${id}`)
  return data
}

export const trackService = {
  create: createTrack,
  update: updateTrack,
  delete: deleteTrack,
  getById: getTrackById,
}
