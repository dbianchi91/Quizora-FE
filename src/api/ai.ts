import { apiClient } from './client'
import { useAuthStore } from '@/store/authStore'
import type { SendMessageRequest, StudyPlanDto } from '@/types/ai'

export const aiApi = {
  getStudyPlan: () =>
    apiClient.get<StudyPlanDto>('/ai/study-plan').then(r => r.data),

  triggerStudyPlan: () =>
    apiClient.post<StudyPlanDto>('/ai/study-plan/generate').then(r => r.data),
}

/**
 * Streams AI chat via SSE (POST with auth header).
 * Yields text chunks from `data: {"chunk":"..."}` lines.
 * Stops on `data: [DONE]` or stream close.
 */
export async function* streamAIChat(request: SendMessageRequest): AsyncGenerator<string> {
  const token = useAuthStore.getState().accessToken
  const response = await fetch('/api/v1/ai/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok || !response.body) {
    throw new Error(`Stream error: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data) as { chunk: string }
          yield parsed.chunk
        } catch { /* ignore malformed lines */ }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
