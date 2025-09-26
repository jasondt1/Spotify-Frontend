export interface UserRequestDto {
  userId?: string
  name?: string
  birthday?: string
  gender?: string
  profilePicture?: string
}

export interface UserResponseDto {
  userId: string
  name: string
  birthday: string
  gender: string
  profilePicture?: string
}
