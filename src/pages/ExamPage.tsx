import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAbandonExam, useAnswerQuestion, useExamState, useSubmitExam, examKeys } from '@/hooks/useExam'
import { useExamStore } from '@/store/examStore'
import ExamTimer from '@/components/exam/ExamTimer'
import QuestionNavigator from '@/components/exam/QuestionNavigator'
import QuestionView from '@/components/exam/QuestionView'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'

export default function ExamPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const questionStartRef = useRef(0)
  const [showAbandonModal, setShowAbandonModal] = useState(false)

  const {
    currentQuestionIndex, localAnswers, studyFeedback,
    setAnswer, setStudyFeedback, goToQuestion, clearSession, setSubmitting, isSubmitting,
  } = useExamStore()

  const { data: state, isLoading } = useExamState(sessionId!, true)
  const answerMut = useAnswerQuestion(sessionId!)
  const submitMut = useSubmitExam(sessionId!)
  const abandonMut = useAbandonExam(sessionId!)
  const sessionType = state?.sessionType
  const expiresAt = state?.expiresAt

  useEffect(() => {
    if (!sessionId || sessionType === 'Study' || !expiresAt) return
    const interval = setInterval(() => {
      qc.invalidateQueries({ queryKey: examKeys.state(sessionId) })
    }, 30_000)
    return () => clearInterval(interval)
  }, [expiresAt, qc, sessionId, sessionType])

  useEffect(() => {
    if (state?.status === 'Completed' || state?.status === 'Expired') {
      navigate(`/results/${sessionId}`)
    }
  }, [navigate, sessionId, state?.status])

  useEffect(() => {
    questionStartRef.current = Date.now()
  }, [currentQuestionIndex])

  const handleAnswer = async (questionId: string, selectedOptionId: string) => {
    const timeSpentSeconds = Math.round((Date.now() - questionStartRef.current) / 1000)
    setAnswer(questionId, selectedOptionId)
    const feedback = await answerMut.mutateAsync({ questionId, selectedOptionId, timeSpentSeconds })
    if (feedback) setStudyFeedback(feedback)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await submitMut.mutateAsync()
    clearSession()
    navigate(`/results/${sessionId}`)
  }

  const handleTimerExpire = useCallback(() => {
    clearSession()
    navigate(`/results/${sessionId}`)
  }, [clearSession, navigate, sessionId])

  const handleAbandon = async () => {
    await abandonMut.mutateAsync()
    clearSession()
    navigate('/')
  }

  if (isLoading) return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6" aria-label="Caricamento sessione">
      <Skeleton className="mb-4 h-6 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </section>
  )

  if (!state) return <p className="py-20 text-center text-gray-400">Sessione non trovata</p>

  const questions = state.questions
  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  const answers = { ...state.answers, ...localAnswers }
  const answeredCount = Object.values(answers).filter(v => v != null).length
  const isStudy = state.sessionType === 'Study'

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-gray-950/95 px-4 py-3 backdrop-blur sm:px-6">
        <section className="mx-auto flex max-w-3xl flex-wrap items-center gap-3" aria-label="Stato sessione">
          <p className="text-sm text-gray-400">{answeredCount}/{questions.length} risposte</p>
          <nav className="ml-auto flex items-center gap-3" aria-label="Azioni esame">
            {state.expiresAt && !isStudy && (
              <ExamTimer
                key={`${state.expiresAt}-${state.serverNow}`}
                expiresAt={state.expiresAt}
                serverNow={state.serverNow}
                onExpire={handleTimerExpire}
              />
            )}
            <button type="button" onClick={() => setShowAbandonModal(true)} className="text-xs text-gray-500 transition-colors hover:text-red-400">
              Abbandona
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Invio...' : isStudy ? 'Completa' : 'Consegna'}
            </button>
          </nav>
        </section>
      </header>

      <article className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6" aria-labelledby="exam-question-title">
        <QuestionNavigator
          questions={questions}
          currentIndex={currentQuestionIndex}
          answers={answers}
          onSelect={goToQuestion}
        />

        <section aria-labelledby="exam-question-title">
          <p className="mb-4 text-xs text-gray-500">Domanda {currentQuestionIndex + 1} di {questions.length}</p>
          <h1 id="exam-question-title" className="sr-only">Domanda corrente</h1>
          <QuestionView
            question={currentQuestion}
            selectedOptionId={answers[currentQuestion.id] ?? null}
            feedback={studyFeedback[currentQuestion.id]}
            onSelect={(optionId) => handleAnswer(currentQuestion.id, optionId)}
          />
        </section>

        <footer className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            Precedente
          </button>
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => goToQuestion(currentQuestionIndex + 1)}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/20"
            >
              Successiva
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Invio...' : isStudy ? 'Completa' : 'Consegna'}
            </button>
          )}
        </footer>
      </article>

      <Modal isOpen={showAbandonModal} onClose={() => setShowAbandonModal(false)} title="Abbandona sessione">
        <p className="mb-6 text-sm text-gray-300">
          Sei sicuro di voler abbandonare? La sessione verrà annullata e non sarà recuperabile.
        </p>
        <footer className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowAbandonModal(false)}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/20"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleAbandon}
            disabled={abandonMut.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-red-500 disabled:opacity-50"
          >
            {abandonMut.isPending ? 'Abbandono...' : 'Abbandona'}
          </button>
        </footer>
      </Modal>
    </main>
  )
}
