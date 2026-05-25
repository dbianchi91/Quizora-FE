export interface UserDto {
  id: string
  email: string
  userName: string
  isEmailConfirmed: boolean
  isCreator: boolean
  isAdmin: boolean
  createdAt: string
  lastLoginAt: string | null
}

export interface AuthResponseDto {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: UserDto
}

export interface RegisterRequest {
  email: string
  userName: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}
