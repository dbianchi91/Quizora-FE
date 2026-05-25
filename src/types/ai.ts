export interface ChatMessageDto {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ChatSessionDto {
  sessionId: string
  messages: ChatMessageDto[]
}

export interface StudyTopicDto { topic: string; priority: 'high' | 'medium' | 'low'; description: string }

export interface StudyPlanDto {
  id: string
  userId: string
  topics: StudyTopicDto[]
  generatedAt: string
  triggerType: 'Manual' | 'Automatic'
}

// Backend ChatStreamRequest: { message, sessionId?, pageContext? }
export interface SendMessageRequest { sessionId?: string | null; message: string; pageContext?: string }
