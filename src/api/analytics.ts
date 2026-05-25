import { apiClient } from './client'
import type {
  AdminOverviewDto,
  CategoryStatsDto,
  ExamHistoryDto,
  LeaderboardEntryDto,
  UserStatsDto,
} from '@/types/analytics'
import type { PagedResult } from '@/types/quiz'

export const analyticsApi = {
  getMyStats: () =>
    apiClient.get<UserStatsDto>('/analytics/me').then(r => r.data),

  getMyCategoryStats: () =>
    apiClient.get<CategoryStatsDto[]>('/analytics/me/categories').then(r => r.data),

  getMyHistory: (page = 1, pageSize = 10) =>
    apiClient
      .get<PagedResult<ExamHistoryDto>>('/analytics/me/history', { params: { page, pageSize } })
      .then(r => r.data),

  getLeaderboard: (categoryId?: string, page = 1, pageSize = 20) =>
    apiClient
      .get<PagedResult<LeaderboardEntryDto>>('/analytics/leaderboard', {
        params: { category: categoryId, page, pageSize },
      })
      .then(r => r.data),

  getAdminOverview: () =>
    apiClient.get<AdminOverviewDto>('/analytics/admin/overview').then(r => r.data),
}
