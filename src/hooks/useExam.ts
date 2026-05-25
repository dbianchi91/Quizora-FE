import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { examApi } from '@/api/exam'
import type { AnswerRequest, StartExamRequest } from '@/types/exam'

export const examKeys = {
  state: (id: string) => ['exam', id, 'state'] as const,
  results: (id: string) => ['exam', id, 'results'] as const,
  history: ['exam', 'history'] as const,
  simulations: (quizId: string) => ['exam', 'simulations', quizId] as const,
}

export const useStartExam = () =>
  useMutation({ mutationFn: (data: StartExamRequest) => examApi.start(data) })

export const useExamState = (sessionId: string, enabled = true) =>
  useQuery({
    queryKey: examKeys.state(sessionId),
    queryFn: () => examApi.getState(sessionId),
    enabled: !!sessionId && enabled,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

export const useAnswerQuestion = (sessionId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AnswerRequest) => examApi.answer(sessionId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: examKeys.state(sessionId) }),
  })
}

export const useSubmitExam = (sessionId: string) =>
  useMutation({ mutationFn: () => examApi.submit(sessionId) })

export const useAbandonExam = (sessionId: string) =>
  useMutation({ mutationFn: () => examApi.abandon(sessionId) })

export const useExamResults = (sessionId: string) =>
  useQuery({ queryKey: examKeys.results(sessionId), queryFn: () => examApi.getResults(sessionId), enabled: !!sessionId })

export const useExamHistory = () =>
  useQuery({ queryKey: examKeys.history, queryFn: examApi.getHistory })

export const useSimulationHistory = (quizId: string) =>
  useQuery({ queryKey: examKeys.simulations(quizId), queryFn: () => examApi.getSimulationHistory(quizId), enabled: !!quizId })
