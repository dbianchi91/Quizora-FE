import { Link, useParams } from 'react-router-dom'
import { CheckCircle, MinusCircle, XCircle } from 'lucide-react'
import { useExamResults } from '@/hooks/useExam'
import ResultsCharts from '@/components/results/ResultsCharts'
import Skeleton from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { data: result, isLoading } = useExamResults(sessionId!)

  if (isLoading) return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12" aria-label="Caricamento risultati">
      <Skeleton className="mb-4 h-8 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </section>
  )

  if (!result) return <p className="py-20 text-center text-gray-400">Risultati non trovati</p>

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="results-title">
      <header className="mb-8 space-y-2">
        <Badge label={result.sessionType} />
        <h1 id="results-title" className="text-2xl font-bold text-white">{result.quizTitle}</h1>
        <time className="block text-sm text-gray-400" dateTime={result.completedAt}>
          {new Date(result.completedAt).toLocaleString('it-IT')}
        </time>
      </header>

      <ResultsCharts result={result} />

      <section className="mt-8" aria-labelledby="review-title">
        <h2 id="review-title" className="mb-3 text-lg font-semibold text-white">Revisione domande</h2>
        <ol className="space-y-3">
          {result.questions.map((q, i) => {
            const status = q.isCorrect ? 'Corretta' : q.selectedOptionId ? 'Errata' : 'Non risposta'
            const StatusIcon = q.isCorrect ? CheckCircle : q.selectedOptionId ? XCircle : MinusCircle
            const iconClass = q.isCorrect ? 'text-green-400' : q.selectedOptionId ? 'text-red-400' : 'text-gray-400'

            return (
              <li key={q.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <article aria-labelledby={`question-${q.id}`} className="space-y-3">
                  <header className="flex items-start gap-2">
                    <StatusIcon size={16} className={cn('mt-0.5 shrink-0', iconClass)} aria-hidden="true" />
                    <h3 id={`question-${q.id}`} className="text-sm font-medium text-white">
                      <span className="sr-only">{status}. </span>
                      {i + 1}. {q.text}
                    </h3>
                  </header>

                  {q.options.length > 0 ? (
                    <ul className="space-y-1 pl-6" aria-label={`Opzioni domanda ${i + 1}`}>
                      {q.options.map(opt => {
                        const isSelected = opt.id === q.selectedOptionId
                        return (
                          <li
                            key={opt.id}
                            className={cn(
                              'rounded-lg px-3 py-1.5 text-xs',
                              opt.isCorrect && 'bg-green-500/20 text-green-300',
                              isSelected && !opt.isCorrect && 'bg-red-500/20 text-red-300',
                              !opt.isCorrect && !isSelected && 'text-gray-400',
                            )}
                          >
                            {opt.text}
                            {isSelected && <span className="sr-only">, risposta selezionata</span>}
                            {opt.isCorrect && <span className="sr-only">, risposta corretta</span>}
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="pl-6 text-xs text-gray-400">{status}</p>
                  )}

                  {q.explanation && (
                    <p className="pl-6 text-xs italic text-blue-300">{q.explanation}</p>
                  )}
                </article>
              </li>
            )
          })}
        </ol>
      </section>

      <nav className="mt-8 flex flex-col gap-3 sm:flex-row" aria-label="Azioni risultati">
        <Link to="/" className="rounded-lg bg-white/10 px-4 py-2 text-center text-sm transition-colors hover:bg-white/20">
          Home
        </Link>
        <Link to={`/quiz/${result.quizId}`} className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold transition-colors hover:bg-indigo-500">
          Rifai il quiz
        </Link>
      </nav>
    </article>
  )
}
