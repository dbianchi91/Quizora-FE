export type SessionType = 'Official' | 'Simulation' | 'Study'
export type SessionStatus = 'InProgress' | 'Completed' | 'Expired' | 'TimedOut' | 'Abandoned'

export interface StartExamRequest { quizId: string; sessionType: SessionType }

export interface StartExamResponse { sessionId: string }

export interface ExamOptionDto { id: string; text: string }

export interface ExamQuestionDto {
  id: string
  text: string
  options: ExamOptionDto[]
}

export interface ExamStateDto {
  sessionId: string
  sessionType: SessionType
  status: SessionStatus
  expiresAt: string | null
  serverNow: string
  questions: ExamQuestionDto[]
  answers: Record<string, string | null>
}

export interface AnswerRequest {
  questionId: string
  selectedOptionId: string | null
  timeSpentSeconds: number
}

export interface StudyFeedbackDto {
  questionId: string
  isCorrect: boolean
  correctOptionId: string
  explanation: string | null
}

export interface ExamResultOptionDto { id: string; text: string; isCorrect: boolean }

export interface ExamResultQuestionDto {
  id: string
  text: string
  explanation: string | null
  selectedOptionId: string | null
  isCorrect: boolean
  options: ExamResultOptionDto[]
}

export interface ExamResultDto {
  sessionId: string
  quizId: string
  quizTitle: string
  sessionType: SessionType
  score: number
  rawScore: number
  completedAt: string
  rank: number | null
  totalParticipants: number | null
  questions: ExamResultQuestionDto[]
}

export interface ExamHistoryItemDto {
  sessionId: string
  quizTitle: string
  sessionType: SessionType
  score: number
  completedAt: string
}
