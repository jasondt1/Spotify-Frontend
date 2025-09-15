import type { TrackRequestDto, TrackResponseDto } from "@/dto/artist"
import { api, authHeader } from "@/services/http"

export async function createTrack(
  dto: TrackRequestDto,
  token?: string
): Promise<TrackResponseDto> {
  const { data } = await api.post<TrackResponseDto>("/api/tracks", dto, {
    headers: authHeader(token),
  })
  return data
}

export async function updateTrack(
  id: string,
  dto: TrackRequestDto,
  token?: string
): Promise<TrackResponseDto> {
  const { data } = await api.put<TrackResponseDto>(`/api/tracks/${id}`, dto, {
    headers: authHeader(token),
  })
  return data
}

export async function deleteTrack(id: string, token?: string): Promise<void> {
  await api.delete(`/api/tracks/${id}`, {
    headers: authHeader(token),
  })
}

export async function getTrackById(
  id: string,
  token?: string
): Promise<TrackResponseDto> {
  const { data } = await api.get<TrackResponseDto>(`/api/tracks/${id}`, {
    headers: authHeader(token),
  })
  return data
}

export const trackService = {
  create: createTrack,
  update: updateTrack,
  delete: deleteTrack,
  getById: getTrackById,
}
