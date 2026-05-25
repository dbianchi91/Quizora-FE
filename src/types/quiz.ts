export interface CategoryDto { id: string; name: string; slug: string }
export interface TagDto { id: string; name: string }

export interface QuizListItemDto {
  id: string
  title: string
  description: string | null
  categoryId: string
  categoryName: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questionCount: number
  estimatedMinutes: number
  tags: string[]
  createdAt: string
}

export interface QuizOptionDto { id: string; text: string }

export interface QuizQuestionDto {
  id: string
  text: string
  explanation: string | null
  options: QuizOptionDto[]
}

export interface QuizDetailDto extends QuizListItemDto {
  creatorName: string
  pointsCorrect: number
  pointsWrong: number
  pointsSkipped: number
  timeLimitSeconds: number | null
  questions: QuizQuestionDto[]
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface GetQuizzesParams {
  page?: number
  pageSize?: number
  categoryId?: string
  difficulty?: string
  search?: string
}
