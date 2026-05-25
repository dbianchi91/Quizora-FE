import { Bot, X } from 'lucide-react'
import { useAIStore } from '@/store/aiStore'
import AIChatPanel from './AIChatPanel'
import StudyPlanTab from './StudyPlanTab'
import { cn } from '@/lib/utils'

export default function AITutorBubble() {
  const { isOpen, toggle, activeTab, setTab } = useAIStore()

  return (
    <>
      <aside
        className={cn(
          'fixed bottom-20 right-4 z-50 flex h-[480px] w-[calc(100vw-2rem)] max-w-80 flex-col overflow-hidden rounded-xl border border-white/10 bg-gray-900 shadow-2xl transition-all duration-300 sm:right-6',
          isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none',
        )}
        aria-label="Tutor AI"
        aria-hidden={!isOpen}
      >
        <nav className="flex shrink-0 border-b border-white/10" aria-label="Sezioni tutor AI">
          {(['chat', 'studyplan'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setTab(tab)}
              aria-pressed={activeTab === tab}
              className={cn(
                'flex-1 border-b-2 py-2.5 text-xs font-semibold transition-colors',
                activeTab === tab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200',
              )}
            >
              {tab === 'chat' ? 'Chat' : 'Piano di studio'}
            </button>
          ))}
        </nav>
        {activeTab === 'chat' ? <AIChatPanel /> : <StudyPlanTab />}
      </aside>

      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 shadow-lg transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={isOpen ? 'Chiudi tutor AI' : 'Apri tutor AI'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <Bot size={20} aria-hidden="true" />}
      </button>
    </>
  )
}
