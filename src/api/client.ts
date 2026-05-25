import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post('/api/v1/auth/refresh', { token: refreshToken })
        useAuthStore.getState().setAuth(data.accessToken, data.refreshToken, data.user)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(original)
      } catch {
        useAuthStore.getState().clearAuth()
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)
