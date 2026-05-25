import { useQuery } from '@tanstack/react-query'
import { quizApi } from '@/api/quiz'
import type { GetQuizzesParams } from '@/types/quiz'

export const quizKeys = {
  all: ['quizzes'] as const,
  list: (params: GetQuizzesParams) => ['quizzes', 'list', params] as const,
  detail: (id: string) => ['quizzes', id] as const,
  categories: ['categories'] as const,
  featured: ['quizzes', 'featured'] as const,
  recent: ['quizzes', 'recent'] as const,
}

export const useQuizzes = (params: GetQuizzesParams = {}) =>
  useQuery({ queryKey: quizKeys.list(params), queryFn: () => quizApi.getQuizzes(params) })

export const useQuizDetail = (id: string) =>
  useQuery({ queryKey: quizKeys.detail(id), queryFn: () => quizApi.getQuizById(id), enabled: !!id })

export const useCategories = () =>
  useQuery({ queryKey: quizKeys.categories, queryFn: quizApi.getCategories, staleTime: 1000 * 60 * 10 })

// Backend has no /quizzes/featured or /quizzes/recent — fall back to paged list
export const useFeaturedQuizzes = () =>
  useQuery({
    queryKey: quizKeys.featured,
    queryFn: () => quizApi.getQuizzes({ pageSize: 10, page: 1 }).then(r => r.items),
    staleTime: 1000 * 60 * 5,
  })

export const useRecentQuizzes = () =>
  useQuery({
    queryKey: quizKeys.recent,
    queryFn: () => quizApi.getQuizzes({ pageSize: 10, page: 2 }).then(r => r.items),
    staleTime: 1000 * 60 * 5,
  })
