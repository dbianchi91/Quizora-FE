import type { AuthResponseDto, LoginRequest, RegisterRequest, UserDto } from '@/types/auth'
import { apiClient } from './client'

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponseDto>('/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponseDto>('/auth/login', data).then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),

  getMe: () =>
    apiClient.get<UserDto>('/users/me').then((r) => r.data),
}
