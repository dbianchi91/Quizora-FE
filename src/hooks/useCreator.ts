import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { creatorApi, type CreateQuestionRequest, type CreateQuizRequest } from '@/api/creator'
import { quizKeys } from './useQuizzes'

export const useMyQuizzes = () =>
  useQuery({ queryKey: ['creator', 'quizzes'], queryFn: creatorApi.getMyQuizzes })

export const useCreateQuiz = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuizRequest) => creatorApi.createQuiz(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['creator', 'quizzes'] }),
  })
}

export const usePublishQuiz = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (quizId: string) => creatorApi.publishQuiz(quizId),
    onSuccess: (_, quizId) => {
      qc.invalidateQueries({ queryKey: quizKeys.detail(quizId) })
      qc.invalidateQueries({ queryKey: ['creator', 'quizzes'] })
    },
  })
}

export const useAddQuestion = (quizId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateQuestionRequest) => creatorApi.addQuestion(quizId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: quizKeys.detail(quizId) }),
  })
}
