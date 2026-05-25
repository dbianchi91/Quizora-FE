import { create } from 'zustand'
import type { ChatMessageDto } from '@/types/ai'

interface AIState {
  sessionId: string | null
  messages: ChatMessageDto[]
  isStreaming: boolean
  isOpen: boolean
  activeTab: 'chat' | 'studyplan'

  open: () => void
  close: () => void
  toggle: () => void
  setTab: (tab: 'chat' | 'studyplan') => void
  setSessionId: (id: string) => void
  addMessage: (msg: ChatMessageDto) => void
  appendToLastMessage: (chunk: string) => void
  startStreaming: (placeholder: ChatMessageDto) => void
  stopStreaming: () => void
}

export const useAIStore = create<AIState>((set) => ({
  sessionId: null,
  messages: [],
  isStreaming: false,
  isOpen: false,
  activeTab: 'chat',

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setTab: (tab) => set({ activeTab: tab }),
  setSessionId: (id) => set({ sessionId: id }),

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  // Adds the assistant placeholder and marks streaming as started
  startStreaming: (placeholder) =>
    set((s) => ({ messages: [...s.messages, placeholder], isStreaming: true })),

  appendToLastMessage: (chunk) =>
    set((s) => {
      const msgs = [...s.messages]
      const last = msgs[msgs.length - 1]
      if (last) msgs[msgs.length - 1] = { ...last, content: last.content + chunk }
      return { messages: msgs }
    }),

  stopStreaming: () => set({ isStreaming: false }),
}))
