import { useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { streamAIChat } from '@/api/ai'
import { useAIStore } from '@/store/aiStore'
import { cn } from '@/lib/utils'
import type { ChatMessageDto } from '@/types/ai'

export default function AIChatPanel() {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLLIElement>(null)
  const { sessionId, messages, isStreaming } = useAIStore()

  const handleSend = async () => {
    const content = input.trim()
    if (!content || isStreaming) return
    setInput('')

    const { addMessage, startStreaming, appendToLastMessage, stopStreaming } = useAIStore.getState()

    const userMsg: ChatMessageDto = {
      id: crypto.randomUUID(), role: 'user', content, createdAt: new Date().toISOString(),
    }
    const assistantPlaceholder: ChatMessageDto = {
      id: crypto.randomUUID(), role: 'assistant', content: '', createdAt: new Date().toISOString(),
    }

    addMessage(userMsg)
    startStreaming(assistantPlaceholder)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

    try {
      const stream = streamAIChat({ sessionId, message: content })
      for await (const chunk of stream) {
        appendToLastMessage(chunk)
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    } finally {
      stopStreaming()
    }
  }

  return (
    <section className="flex h-full flex-col" aria-labelledby="ai-chat-title">
      <h2 id="ai-chat-title" className="sr-only">Chat tutor AI</h2>

      <ol className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {messages.length === 0 && (
          <li className="mt-8 text-center text-sm text-gray-400">Ciao! Sono il tuo tutor AI. Come posso aiutarti?</li>
        )}
        {messages.map((msg) => (
          <li key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <p className={cn(
              'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'rounded-br-sm bg-indigo-600 text-white'
                : 'rounded-bl-sm bg-white/10 text-gray-200',
            )}>
              <span className="sr-only">{msg.role === 'user' ? 'Tu: ' : 'Tutor AI: '}</span>
              {msg.content || (isStreaming && msg.role === 'assistant'
                ? <span className="animate-pulse" aria-label="Risposta in corso">...</span>
                : null
              )}
            </p>
          </li>
        ))}
        <li ref={bottomRef} aria-hidden="true" />
      </ol>

      <form
        className="flex gap-2 border-t border-white/10 p-3"
        onSubmit={e => { e.preventDefault(); handleSend() }}
      >
        <label htmlFor="ai-message" className="sr-only">Messaggio per il tutor AI</label>
        <input
          id="ai-message"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          disabled={isStreaming}
          className="flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="rounded-xl bg-indigo-600 p-2 transition-colors hover:bg-indigo-500 disabled:opacity-40"
          aria-label="Invia messaggio"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
    </section>
  )
}
