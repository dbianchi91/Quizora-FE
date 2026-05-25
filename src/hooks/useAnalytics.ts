import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/api/analytics'

export const useMyStats = () =>
  useQuery({
    queryKey: ['analytics', 'me'],
    queryFn: analyticsApi.getMyStats,
  })

export const useMyCategoryStats = () =>
  useQuery({
    queryKey: ['analytics', 'me', 'categories'],
    queryFn: analyticsApi.getMyCategoryStats,
  })

export const useMyHistory = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: ['analytics', 'me', 'history', page, pageSize],
    queryFn: () => analyticsApi.getMyHistory(page, pageSize),
  })

export const useLeaderboard = (categoryId?: string, page = 1, pageSize = 20) =>
  useQuery({
    queryKey: ['analytics', 'leaderboard', categoryId, page, pageSize],
    queryFn: () => analyticsApi.getLeaderboard(categoryId, page, pageSize),
  })

export const useAdminOverview = () =>
  useQuery({
    queryKey: ['analytics', 'admin', 'overview'],
    queryFn: analyticsApi.getAdminOverview,
  })
