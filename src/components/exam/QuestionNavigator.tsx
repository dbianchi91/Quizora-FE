import { cn } from '@/lib/utils'
import type { ExamQuestionDto } from '@/types/exam'

interface Props {
  questions: ExamQuestionDto[]
  currentIndex: number
  answers: Record<string, string | null>
  onSelect: (index: number) => void
}

export default function QuestionNavigator({ questions, currentIndex, answers, onSelect }: Props) {
  return (
    <nav aria-label="Navigazione domande">
      <ol className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const answered = answers[q.id] != null
          const active = i === currentIndex
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={active ? 'step' : undefined}
                aria-label={`Domanda ${i + 1}${answered ? ', risposta data' : ', senza risposta'}`}
                className={cn(
                  'h-8 w-8 rounded-md text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500',
                  active ? 'bg-indigo-600 text-white' :
                  answered ? 'bg-indigo-500/30 text-indigo-300' :
                  'bg-white/10 text-gray-400 hover:bg-white/20',
                )}
              >
                {i + 1}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
