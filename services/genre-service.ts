import type { GenreRequestDto, GenreResponseDto } from "@/dto/genre"
import { api } from "@/services/http"

export async function createGenre(
  dto: GenreRequestDto
): Promise<GenreResponseDto> {
  const { data } = await api.post<GenreResponseDto>("/api/genres", dto)
  return data
}

export async function getGenres(): Promise<GenreResponseDto[]> {
  const { data } = await api.get<GenreResponseDto[]>("/api/genres")
  return data
}

export async function getGenreById(
  id: string
): Promise<GenreResponseDto> {
  const { data } = await api.get<GenreResponseDto>(`/api/genres/${id}`)
  return data
}

export async function deleteGenre(id: string): Promise<void> {
  await api.delete(`/api/genres/${id}`)
}

export async function updateGenre(
  id: string,
  dto: GenreRequestDto
): Promise<GenreResponseDto> {
  const { data } = await api.put<GenreResponseDto>(`/api/genres/${id}`, dto)
  return data
}

export const genreService = {
  create: createGenre,
  getAll: getGenres,
  getById: getGenreById,
  delete: deleteGenre,
  update: updateGenre,
}
