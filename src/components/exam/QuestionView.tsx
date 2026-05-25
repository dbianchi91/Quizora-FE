import { cn } from '@/lib/utils'
import type { ExamQuestionDto, StudyFeedbackDto } from '@/types/exam'

interface Props {
  question: ExamQuestionDto
  selectedOptionId: string | null
  feedback?: StudyFeedbackDto
  onSelect: (optionId: string) => void
}

export default function QuestionView({ question, selectedOptionId, feedback, onSelect }: Props) {
  return (
    <section className="space-y-6" aria-labelledby={`question-title-${question.id}`}>
      <h2 id={`question-title-${question.id}`} className="text-lg font-medium leading-relaxed text-white">
        {question.text}
      </h2>

      <fieldset className="space-y-3">
        <legend className="sr-only">Scegli una risposta</legend>
        {question.options.map(opt => {
          const isSelected = selectedOptionId === opt.id
          const isCorrect = feedback?.correctOptionId === opt.id
          const isWrong = feedback && isSelected && !isCorrect

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => !feedback && onSelect(opt.id)}
              disabled={!!feedback}
              aria-pressed={isSelected}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-left text-sm transition-all',
                !feedback && !isSelected && 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
                !feedback && isSelected && 'border-indigo-500 bg-indigo-500/20',
                isCorrect && 'border-green-500 bg-green-500/20 text-green-300',
                isWrong && 'border-red-500 bg-red-500/20 text-red-300',
              )}
            >
              {opt.text}
              {isSelected && <span className="sr-only">, selezionata</span>}
              {isCorrect && <span className="sr-only">, corretta</span>}
              {isWrong && <span className="sr-only">, errata</span>}
            </button>
          )
        })}
      </fieldset>

      {feedback?.explanation && (
        <aside className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-200">
          <span className="font-semibold">Spiegazione: </span>{feedback.explanation}
        </aside>
      )}
    </section>
  )
}
