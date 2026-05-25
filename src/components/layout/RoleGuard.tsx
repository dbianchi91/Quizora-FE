import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface Props { role: 'creator' | 'admin'; children: React.ReactNode }

export default function RoleGuard({ role, children }: Props) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (role === 'creator' && !user.isCreator && !user.isAdmin) return <Navigate to="/" replace />
  if (role === 'admin' && !user.isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}
