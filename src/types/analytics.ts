export interface UserStatsDto {
  totalExams: number
  totalCorrect: number
  totalAnswered: number
  averageScore: number
  bestScore: number
  totalTimeSpentSeconds: number
  updatedAt: string
}

export interface CategoryStatsDto {
  categoryId: string
  categoryName: string
  totalExams: number
  averageScore: number
  weakAreaScore: number
}

export interface ExamHistoryDto {
  sessionId: string
  quizTitle: string | null
  score: number
  normalizedScore: number
  correctCount: number
  wrongCount: number
  skippedCount: number
  sessionType: string
  completedAt: string
}

export interface LeaderboardEntryDto {
  rank: number
  userId: string
  userName: string
  bestScore: number
  totalExams: number
}

export interface AdminOverviewDto {
  totalActiveUsers: number
  totalExamsAllTime: number
  examsToday: number
  globalAverageScore: number
}
