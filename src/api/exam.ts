import { apiClient } from './client'
import type {
  AnswerRequest, ExamHistoryItemDto, ExamResultDto,
  ExamStateDto, StartExamRequest, StartExamResponse, StudyFeedbackDto,
} from '@/types/exam'

interface RawExamOptionStateDto {
  optionId?: string
  id?: string
  text: string
}

interface RawExamQuestionStateDto {
  questionId?: string
  id?: string
  text: string
  options: RawExamOptionStateDto[]
  answeredOptionId?: string | null
}

interface RawExamStateDto {
  sessionId: string
  sessionType?: string
  type?: string
  status: string
  expiresAt?: string | null
  serverNow?: string
  remainingSeconds?: number
  questions: RawExamQuestionStateDto[]
  answers?: Record<string, string | null>
}

interface RawAnswerFeedbackDto {
  questionId?: string
  isCorrect: boolean
  correctOptionId: string | null
  explanation?: string | null
  correctExplanation?: string | null
}

interface RawExamResultOptionDto {
  optionId?: string
  id?: string
  text: string
  isCorrect: boolean
}

interface RawExamResultQuestionDto {
  questionId?: string
  id?: string
  text: string
  explanation: string | null
  selectedOptionId: string | null
  correctOptionId?: string
  isCorrect: boolean
  options?: RawExamResultOptionDto[]
}

interface RawLeaderboardEntryDto {
  rank: number
  userId: string
}

interface RawExamResultDto {
  sessionId: string
  quizId: string
  quizTitle: string
  sessionType?: string
  type?: string
  score?: number
  rawScore?: number
  normalizedScore?: number
  completedAt?: string | null
  startedAt?: string
  questions: RawExamResultQuestionDto[]
  rank?: number | null
  totalParticipants?: number | null
  leaderboard?: RawLeaderboardEntryDto[]
}

function normalizeExamState(data: RawExamStateDto): ExamStateDto {
  const now = new Date()
  const hasTimer = typeof data.remainingSeconds === 'number' && Number.isFinite(data.remainingSeconds)
    && data.remainingSeconds < 2_147_483_647
  const answers: Record<string, string | null> = { ...(data.answers ?? {}) }

  const questions = data.questions.map(question => {
    const questionId = question.id ?? question.questionId ?? ''
    const answeredOptionId = answers[questionId] ?? question.answeredOptionId ?? null
    answers[questionId] = answeredOptionId

    return {
      id: questionId,
      text: question.text,
      options: question.options.map(option => ({
        id: option.id ?? option.optionId ?? '',
        text: option.text,
      })),
    }
  })

  return {
    sessionId: data.sessionId,
    sessionType: (data.sessionType ?? data.type) as ExamStateDto['sessionType'],
    status: data.status as ExamStateDto['status'],
    expiresAt: data.expiresAt ?? (hasTimer ? new Date(now.getTime() + data.remainingSeconds! * 1000).toISOString() : null),
    serverNow: data.serverNow ?? now.toISOString(),
    questions,
    answers,
  }
}

function normalizeAnswerFeedback(data: RawAnswerFeedbackDto, questionId: string): StudyFeedbackDto | null {
  if (!data.correctOptionId && !data.explanation && !data.correctExplanation) return null

  return {
    questionId: data.questionId ?? questionId,
    isCorrect: data.isCorrect,
    correctOptionId: data.correctOptionId ?? '',
    explanation: data.explanation ?? data.correctExplanation ?? null,
  }
}

function normalizeExamResults(data: RawExamResultDto): ExamResultDto {
  return {
    sessionId: data.sessionId,
    quizId: data.quizId,
    quizTitle: data.quizTitle,
    sessionType: (data.sessionType ?? data.type) as ExamResultDto['sessionType'],
    score: data.normalizedScore ?? data.score ?? 0,
    rawScore: data.rawScore ?? data.score ?? 0,
    completedAt: data.completedAt ?? data.startedAt ?? new Date().toISOString(),
    rank: data.rank ?? null,
    totalParticipants: data.totalParticipants ?? data.leaderboard?.length ?? null,
    questions: data.questions.map(question => ({
      id: question.id ?? question.questionId ?? '',
      text: question.text,
      explanation: question.explanation,
      selectedOptionId: question.selectedOptionId,
      isCorrect: question.isCorrect,
      options: (question.options ?? []).map(option => ({
        id: option.id ?? option.optionId ?? '',
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    })),
  }
}

export const examApi = {
  start: (data: StartExamRequest) =>
    apiClient.post<StartExamResponse>('/exams/start', data).then(r => r.data),

  getState: (sessionId: string) =>
    apiClient.get<RawExamStateDto>(`/exams/${sessionId}/state`).then(r => normalizeExamState(r.data)),

  answer: (sessionId: string, data: AnswerRequest) =>
    apiClient
      .post<RawAnswerFeedbackDto>(`/exams/${sessionId}/answer`, data)
      .then(r => normalizeAnswerFeedback(r.data, data.questionId)),

  submit: (sessionId: string) =>
    apiClient.post(`/exams/${sessionId}/submit`),

  abandon: (sessionId: string) =>
    apiClient.post(`/exams/${sessionId}/abandon`),

  getResults: (sessionId: string) =>
    apiClient.get<RawExamResultDto>(`/exams/${sessionId}/results`).then(r => normalizeExamResults(r.data)),

  getHistory: () =>
    apiClient.get<ExamHistoryItemDto[]>('/exams/history').then(r => r.data),

  getSimulationHistory: (quizId: string) =>
    apiClient.get<ExamHistoryItemDto[]>(`/exams/simulations/${quizId}`).then(r => r.data),
}
