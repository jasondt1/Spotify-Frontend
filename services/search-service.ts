import { SearchResponseDto } from "@/dto/search"
import { BaseService } from "@/services/base-service"

class SearchService extends BaseService {
  async search(query: string, token?: string): Promise<SearchResponseDto> {
    const { data } = await super.get<SearchResponseDto>("/api/search", token, {
      params: { q: query },
    })
    return data
  }
}

export const searchService = new SearchService()
