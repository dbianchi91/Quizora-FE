import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserDto } from '@/types/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserDto | null
  setAuth: (accessToken: string, refreshToken: string, user: UserDto) => void
  setUser: (user: UserDto) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'quizora-auth' }
  )
)
