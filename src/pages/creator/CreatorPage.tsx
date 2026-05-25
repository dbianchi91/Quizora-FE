import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useMyQuizzes, usePublishQuiz } from '@/hooks/useCreator'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'

export default function CreatorPage() {
  const { data: quizzes, isLoading } = useMyQuizzes()
  const publish = usePublishQuiz()

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="creator-title">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 id="creator-title" className="text-2xl font-bold text-white">I miei quiz</h1>
        <Link
          to="/creator/quiz/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-indigo-500"
        >
          <Plus size={16} aria-hidden="true" /> Nuovo quiz
        </Link>
      </header>

      {isLoading ? (
        <section className="space-y-3" aria-label="Caricamento quiz">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </section>
      ) : (
        <section aria-live="polite">
          {quizzes?.length === 0 ? (
            <p className="py-12 text-center text-gray-400">Nessun quiz ancora. Crea il tuo primo quiz!</p>
          ) : (
            <ul className="space-y-3">
              {quizzes?.map(quiz => (
                <li key={quiz.id}>
                  <article className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
                    <header className="flex-1">
                      <h2 className="font-medium text-white">{quiz.title}</h2>
                      <p className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge label={quiz.difficulty} />
                        <span className="text-xs text-gray-400">{quiz.questionCount} domande</span>
                      </p>
                    </header>
                    <nav className="flex items-center gap-2" aria-label={`Azioni per ${quiz.title}`}>
                      <Link
                        to={`/creator/quiz/${quiz.id}/edit`}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-xs transition-colors hover:bg-white/20"
                      >
                        Modifica
                      </Link>
                      <button
                        type="button"
                        onClick={() => publish.mutate(quiz.id)}
                        disabled={publish.isPending}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs transition-colors hover:bg-indigo-500 disabled:opacity-50"
                      >
                        Pubblica
                      </button>
                    </nav>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </section>
  )
}
