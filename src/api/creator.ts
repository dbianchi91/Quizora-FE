import { apiClient } from './client'
import type { QuizListItemDto } from '@/types/quiz'

export interface CreateQuizRequest {
  title: string
  description?: string
  categoryId: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeLimitSeconds?: number
  pointsCorrect: number
  pointsWrong: number
  pointsSkipped: number
  tags?: string[]
}

export interface CreateQuestionRequest {
  text: string
  explanation?: string
  options: { text: string; isCorrect: boolean }[]
}

export const creatorApi = {
  getMyQuizzes: () =>
    apiClient.get<QuizListItemDto[]>('/creator/quizzes').then(r => r.data),

  createQuiz: (data: CreateQuizRequest) =>
    apiClient.post<{ id: string }>('/quizzes', data).then(r => r.data),

  updateQuiz: (id: string, data: Partial<CreateQuizRequest>) =>
    apiClient.put(`/quizzes/${id}`, data),

  publishQuiz: (id: string) =>
    apiClient.post(`/quizzes/${id}/publish`),

  addQuestion: (quizId: string, data: CreateQuestionRequest) =>
    apiClient.post(`/quizzes/${quizId}/questions`, data).then(r => r.data),

  deleteQuestion: (quizId: string, questionId: string) =>
    apiClient.delete(`/quizzes/${quizId}/questions/${questionId}`),
}
