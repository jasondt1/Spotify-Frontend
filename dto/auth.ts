export interface RegisterInput {
  email: string
  password: string
  name: string
  gender?: string
  dob: { day: string; month: string; year: string }
}

export interface LoginInput {
  email: string
  password: string
}

export interface CurrentUser {
  userId: string
  name: string
  birthday: string
  gender: string
}

