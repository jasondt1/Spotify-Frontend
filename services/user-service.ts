import { UserRequestDto, UserResponseDto } from "@/dto/user"
import { BaseService } from "@/services/base-service"

class UserService extends BaseService {
  async getAll(token?: string): Promise<UserResponseDto[]> {
    try {
      const { data } = await this.get<UserResponseDto[]>("/api/users", token)
      return data
    } catch (err: any) {
      throw err
    }
  }

  async getById(id: string, token?: string): Promise<UserResponseDto> {
    try {
      const { data } = await this.get<UserResponseDto>(
        `/api/users/${id}`,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async getMe(token?: string): Promise<UserResponseDto> {
    try {
      const { data } = await this.get<UserResponseDto>("/api/users/me", token)
      return data
    } catch (err: any) {
      throw err
    }
  }

  async update(
    id: string,
    dto: UserRequestDto,
    token?: string
  ): Promise<UserResponseDto> {
    try {
      const { data } = await this.put<UserResponseDto>(
        `/api/users/${id}`,
        dto,
        token
      )
      return data
    } catch (err: any) {
      throw err
    }
  }

  async remove(id: string, token?: string): Promise<void> {
    try {
      await this.delete<void>(`/api/users/${id}`, token)
    } catch (err: any) {
      throw err
    }
  }
}

export const userService = new UserService()
