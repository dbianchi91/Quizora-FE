import { apiClient } from './client'
import type { CategoryDto, GetQuizzesParams, PagedResult, QuizDetailDto, QuizListItemDto } from '@/types/quiz'

type QuizListResponse = PagedResult<QuizListItemDto> | QuizListItemDto[]

function normalizeQuizList(data: QuizListResponse, params: GetQuizzesParams): PagedResult<QuizListItemDto> {
  if (Array.isArray(data)) {
    return {
      items: data,
      totalCount: data.length,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? data.length,
    }
  }

  return {
    items: Array.isArray(data.items) ? data.items : [],
    totalCount: data.totalCount ?? 0,
    page: data.page ?? params.page ?? 1,
    pageSize: data.pageSize ?? params.pageSize ?? 0,
  }
}

export const quizApi = {
  getQuizzes: (params: GetQuizzesParams = {}) =>
    apiClient.get<QuizListResponse>('/quizzes', { params }).then(r => normalizeQuizList(r.data, params)),

  getQuizById: (id: string) =>
    apiClient.get<QuizDetailDto>(`/quizzes/${id}`).then(r => r.data),

  getCategories: () =>
    apiClient.get<CategoryDto[]>('/categories').then(r => r.data),
}
