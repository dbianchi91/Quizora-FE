import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Clock, HelpCircle, Star } from 'lucide-react'
import { useQuizDetail } from '@/hooks/useQuizzes'
import { useStartExam } from '@/hooks/useExam'
import { useExamStore } from '@/store/examStore'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { SessionType } from '@/types/exam'

const sessionTypes: { value: SessionType; label: string; desc: string }[] = [
  { value: 'Official', label: 'Ufficiale', desc: 'Con timer, conta per la classifica' },
  { value: 'Simulation', label: 'Simulazione', desc: 'Con timer, statistiche separate' },
  { value: 'Study', label: 'Studio', desc: 'Senza timer, feedback immediato' },
]

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<SessionType>('Official')

  const { data: quiz, isLoading } = useQuizDetail(id!)
  const startExam = useStartExam()
  const initSession = useExamStore((s) => s.initSession)

  const handleStart = async () => {
    const res = await startExam.mutateAsync({ quizId: id!, sessionType: selectedType })
    initSession(res.sessionId)
    navigate(`/exam/${res.sessionId}`)
  }

  if (isLoading) return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12" aria-label="Caricamento quiz">
      <Skeleton className="mb-4 h-8 w-2/3" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="h-48 w-full" />
    </section>
  )

  if (!quiz) return <p className="py-20 text-center text-gray-400">Quiz non trovato</p>

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="quiz-title">
      <header className="space-y-4">
        <ul className="flex flex-wrap gap-2" aria-label="Dettagli quiz">
          <li><Badge label={quiz.difficulty} /></li>
          <li><Badge label={quiz.categoryName} /></li>
          {quiz.tags.map(t => <li key={t}><Badge label={t} /></li>)}
        </ul>

        <h1 id="quiz-title" className="text-2xl font-bold text-white sm:text-3xl">{quiz.title}</h1>
        {quiz.description && <p className="text-gray-300">{quiz.description}</p>}

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400" aria-label="Informazioni quiz">
          <li className="flex items-center gap-1">
            <HelpCircle size={14} aria-hidden="true" /> {quiz.questionCount} domande
          </li>
          {quiz.timeLimitSeconds && (
            <li className="flex items-center gap-1">
              <Clock size={14} aria-hidden="true" /> {Math.round(quiz.timeLimitSeconds / 60)} minuti
            </li>
          )}
          <li className="flex items-center gap-1">
            <Star size={14} aria-hidden="true" /> +{quiz.pointsCorrect} / -{quiz.pointsWrong}
          </li>
          <li>di {quiz.creatorName}</li>
        </ul>
      </header>

      <footer className="mt-8">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold transition-colors hover:bg-indigo-500 sm:w-auto"
        >
          Inizia quiz
        </button>
      </footer>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Scegli modalita">
        <fieldset className="mb-6 space-y-3">
          <legend className="sr-only">Tipo di sessione</legend>
          {sessionTypes.map(st => (
            <label
              key={st.value}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                selectedType === st.value ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20',
              )}
            >
              <input
                type="radio"
                name="sessionType"
                value={st.value}
                checked={selectedType === st.value}
                onChange={() => setSelectedType(st.value)}
                className="mt-0.5"
              />
              <span>
                <span className="block text-sm font-medium">{st.label}</span>
                <span className="block text-xs text-gray-400">{st.desc}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <button
          type="button"
          onClick={handleStart}
          disabled={startExam.isPending}
          aria-busy={startExam.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {startExam.isPending ? 'Avvio...' : 'Inizia'}
        </button>
      </Modal>
    </article>
  )
}
