import { apiClient } from './client'
import type { UserDto } from '@/types/auth'

export interface AdminUsersResponse { items: UserDto[]; totalCount: number }

export const adminApi = {
  getUsers: (page = 1, pageSize = 20) =>
    apiClient.get<AdminUsersResponse>('/admin/users', { params: { page, pageSize } }).then(r => r.data),

  // Backend endpoints: /admin/users/{userId}/grant-creator and /revoke-creator
  grantCreator: (userId: string) =>
    apiClient.post(`/admin/users/${userId}/grant-creator`),

  revokeCreator: (userId: string) =>
    apiClient.post(`/admin/users/${userId}/revoke-creator`),
}
