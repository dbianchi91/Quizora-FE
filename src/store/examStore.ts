import { create } from 'zustand'
import type { StudyFeedbackDto } from '@/types/exam'

interface ExamState {
  sessionId: string | null
  currentQuestionIndex: number
  localAnswers: Record<string, string | null>
  studyFeedback: Record<string, StudyFeedbackDto>
  isSubmitting: boolean

  initSession: (sessionId: string) => void
  setAnswer: (questionId: string, optionId: string | null) => void
  setStudyFeedback: (feedback: StudyFeedbackDto) => void
  goToQuestion: (index: number) => void
  setSubmitting: (v: boolean) => void
  clearSession: () => void
}

const initialState = {
  sessionId: null,
  currentQuestionIndex: 0,
  localAnswers: {},
  studyFeedback: {},
  isSubmitting: false,
}

export const useExamStore = create<ExamState>((set) => ({
  ...initialState,

  initSession: (sessionId) => set({ ...initialState, sessionId }),

  setAnswer: (questionId, optionId) =>
    set((s) => ({ localAnswers: { ...s.localAnswers, [questionId]: optionId } })),

  setStudyFeedback: (feedback) =>
    set((s) => ({ studyFeedback: { ...s.studyFeedback, [feedback.questionId]: feedback } })),

  goToQuestion: (index) => set({ currentQuestionIndex: index }),

  setSubmitting: (v) => set({ isSubmitting: v }),

  clearSession: () => set(initialState),
}))
