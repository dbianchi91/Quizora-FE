import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import type { LoginRequest, RegisterRequest } from '@/types/auth'

export const useRegister = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user)
      navigate('/')
    },
  })
}

export const useLogin = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user)
      navigate('/')
    },
  })
}

export const useLogout = () => {
  const { refreshToken, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(refreshToken!),
    onSettled: () => {
      clearAuth()
      qc.clear()
      navigate('/login')
    },
  })
}
