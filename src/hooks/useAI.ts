import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aiApi } from '@/api/ai'

export const aiKeys = { studyPlan: ['ai', 'study-plan'] as const }

export const useStudyPlan = () =>
  useQuery({ queryKey: aiKeys.studyPlan, queryFn: aiApi.getStudyPlan, retry: false })

export const useTriggerStudyPlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: aiApi.triggerStudyPlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: aiKeys.studyPlan }),
  })
}
