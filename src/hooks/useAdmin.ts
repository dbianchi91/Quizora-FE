import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'

export const adminKeys = { users: (page: number) => ['admin', 'users', page] as const }

export const useAdminUsers = (page = 1) =>
  useQuery({ queryKey: adminKeys.users(page), queryFn: () => adminApi.getUsers(page) })

export const useAssignCreator = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, assign }: { userId: string; assign: boolean }) =>
      assign ? adminApi.grantCreator(userId) : adminApi.revokeCreator(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}
