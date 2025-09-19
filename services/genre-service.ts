import type { GenreRequestDto, GenreResponseDto } from "@/dto/genre"
import { api, authHeader } from "@/services/http"

async function createGenre(
  dto: GenreRequestDto,
  token?: string
): Promise<GenreResponseDto> {
  try {
    const { data } = await api.post<GenreResponseDto>("/api/genres", dto, {
      headers: authHeader(token),
    })
    return data
  } catch (err: any) {
    throw err
  }
}

async function getGenres(token?: string): Promise<GenreResponseDto[]> {
  try {
    const { data } = await api.get<GenreResponseDto[]>("/api/genres", {
      headers: authHeader(token),
    })
    return data
  } catch (err: any) {
    throw err
  }
}

async function getGenreById(
  id: string,
  token?: string
): Promise<GenreResponseDto> {
  try {
    const { data } = await api.get<GenreResponseDto>(`/api/genres/${id}`, {
      headers: authHeader(token),
    })
    return data
  } catch (err: any) {
    throw err
  }
}

async function deleteGenre(id: string, token?: string): Promise<void> {
  try {
    await api.delete(`/api/genres/${id}`, {
      headers: authHeader(token),
    })
  } catch (err: any) {
    throw err
  }
}

async function updateGenre(
  id: string,
  dto: GenreRequestDto,
  token?: string
): Promise<GenreResponseDto> {
  try {
    const { data } = await api.put<GenreResponseDto>(`/api/genres/${id}`, dto, {
      headers: authHeader(token),
    })
    return data
  } catch (err: any) {
    throw err
  }
}

export const genreService = {
  create: createGenre,
  getAll: getGenres,
  getById: getGenreById,
  delete: deleteGenre,
  update: updateGenre,
}
