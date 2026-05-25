import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { useAddQuestion, useCreateQuiz } from '@/hooks/useCreator'
import { useCategories, useQuizDetail } from '@/hooks/useQuizzes'

const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Seleziona una categoria'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  timeLimitSeconds: z.number().nonnegative().optional(),
  pointsCorrect: z.number().min(0),
  pointsWrong: z.number().min(0),
  pointsSkipped: z.number().min(0),
})

type QuizForm = z.infer<typeof quizSchema>

interface QuestionForm {
  text: string
  explanation: string
  options: { text: string; isCorrect: boolean }[]
}

const blankQuestion = (): QuestionForm => ({
  text: '',
  explanation: '',
  options: [
    { text: '', isCorrect: true }, { text: '', isCorrect: false },
    { text: '', isCorrect: false }, { text: '', isCorrect: false },
  ],
})

const fieldClass = 'w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
const selectClass = 'w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function QuizEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const { data: categories } = useCategories()
  const { data: existingQuiz } = useQuizDetail(id ?? '')
  const createQuiz = useCreateQuiz()
  const addQuestion = useAddQuestion(id ?? '')

  const [quizId, setQuizId] = useState<string | null>(id ?? null)
  const [addedQuestions, setAddedQuestions] = useState<QuestionForm[]>([])
  const [newQuestion, setNewQuestion] = useState<QuestionForm>(blankQuestion())
  const [saveError, setSaveError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<QuizForm>({
    resolver: zodResolver(quizSchema),
    defaultValues: existingQuiz ? {
      title: existingQuiz.title,
      description: existingQuiz.description ?? '',
      categoryId: existingQuiz.categoryId,
      difficulty: existingQuiz.difficulty,
      pointsCorrect: existingQuiz.pointsCorrect,
      pointsWrong: existingQuiz.pointsWrong,
      pointsSkipped: existingQuiz.pointsSkipped,
    } : { pointsCorrect: 1, pointsWrong: 0.2, pointsSkipped: 0, difficulty: 'Medium' as const },
  })

  const onSaveQuiz = async (data: QuizForm) => {
    if (!quizId) {
      setSaveError(null)
      try {
        const res = await createQuiz.mutateAsync({
          ...data,
          timeLimitSeconds: Number.isFinite(data.timeLimitSeconds) ? data.timeLimitSeconds : undefined,
        })
        setQuizId(res.id)
      } catch (err: unknown) {
        const res = (err as { response?: { data?: { detail?: string; title?: string } } }).response?.data
        setSaveError(res?.detail ?? res?.title ?? 'Errore nel salvataggio del quiz.')
      }
    }
  }

  const onAddQuestion = async () => {
    if (!quizId || !newQuestion.text.trim()) return
    await addQuestion.mutateAsync({
      text: newQuestion.text,
      explanation: newQuestion.explanation || undefined,
      options: newQuestion.options.filter(o => o.text.trim()),
    })
    setAddedQuestions(prev => [...prev, newQuestion])
    setNewQuestion(blankQuestion())
  }

  const updateOption = (idx: number, field: 'text' | 'isCorrect', value: string | boolean) =>
    setNewQuestion(q => ({
      ...q, options: q.options.map((o, i) =>
        i === idx ? { ...o, [field]: field === 'isCorrect' ? true : value } :
        field === 'isCorrect' ? { ...o, isCorrect: false } : o
      ),
    }))

  return (
    <article className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="quiz-editor-title">
      <header>
        <h1 id="quiz-editor-title" className="text-2xl font-bold text-white">
          {isEdit ? 'Modifica quiz' : 'Nuovo quiz'}
        </h1>
        {!isEdit && (
          <ol className="mt-3 flex gap-4 text-sm" aria-label="Passaggi">
            <li className={`flex items-center gap-1.5 font-medium ${!quizId ? 'text-indigo-400' : 'text-gray-500'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${!quizId ? 'bg-indigo-600 text-white' : 'bg-white/10'}`}>1</span>
              Informazioni
            </li>
            <li className="text-gray-600">→</li>
            <li className={`flex items-center gap-1.5 font-medium ${quizId ? 'text-indigo-400' : 'text-gray-500'}`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${quizId ? 'bg-indigo-600 text-white' : 'bg-white/10'}`}>2</span>
              Domande
            </li>
          </ol>
        )}
      </header>

      {!quizId && (
        <form onSubmit={handleSubmit(onSaveQuiz)} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5" aria-labelledby="quiz-info-title">
          <h2 id="quiz-info-title" className="font-semibold text-white">Informazioni quiz</h2>

          <p>
            <label htmlFor="quiz-title" className="mb-1 block text-sm text-gray-300">Titolo</label>
            <input id="quiz-title" {...register('title')} placeholder="Titolo" className={fieldClass} />
            {errors.title && <span className="mt-1 block text-xs text-red-400">Il titolo deve essere di almeno 3 caratteri</span>}
          </p>

          <p>
            <label htmlFor="quiz-description" className="mb-1 block text-sm text-gray-300">Descrizione</label>
            <textarea id="quiz-description" {...register('description')} placeholder="Descrizione opzionale" rows={2} className={fieldClass} />
          </p>

          <p>
            <label htmlFor="quiz-category" className="mb-1 block text-sm text-gray-300">Categoria</label>
            <select id="quiz-category" {...register('categoryId')} className={selectClass}>
              <option value="">Seleziona categoria</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <span className="mt-1 block text-xs text-red-400">{errors.categoryId.message}</span>}
          </p>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Impostazioni quiz">
            <p>
              <label htmlFor="quiz-difficulty" className="mb-1 block text-sm text-gray-300">Difficoltà</label>
              <select id="quiz-difficulty" {...register('difficulty')} className={selectClass}>
                <option value="Easy">Facile</option>
                <option value="Medium">Medio</option>
                <option value="Hard">Difficile</option>
              </select>
            </p>
            <p>
              <label htmlFor="quiz-time-limit" className="mb-1 block text-sm text-gray-300">Tempo limite <span className="text-gray-500">(secondi, opzionale)</span></label>
              <input id="quiz-time-limit" {...register('timeLimitSeconds', { valueAsNumber: true })} type="number" placeholder="es. 3600" className={fieldClass} />
            </p>
          </section>

          <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <legend className="mb-1 text-sm text-gray-300">Punteggi per risposta</legend>
            <p>
              <label htmlFor="points-correct" className="mb-1 block text-sm text-gray-300">Corretta</label>
              <input id="points-correct" {...register('pointsCorrect', { valueAsNumber: true })} type="number" step="0.1" placeholder="es. 1" className={fieldClass} />
            </p>
            <p>
              <label htmlFor="points-wrong" className="mb-1 block text-sm text-gray-300">Errata</label>
              <input id="points-wrong" {...register('pointsWrong', { valueAsNumber: true })} type="number" step="0.1" placeholder="es. 0.2" className={fieldClass} />
            </p>
            <p>
              <label htmlFor="points-skipped" className="mb-1 block text-sm text-gray-300">Omessa</label>
              <input id="points-skipped" {...register('pointsSkipped', { valueAsNumber: true })} type="number" step="0.1" placeholder="es. 0" className={fieldClass} />
            </p>
          </fieldset>

          {saveError && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{saveError}</p>
          )}

          <button
            type="submit"
            disabled={createQuiz.isPending}
            aria-busy={createQuiz.isPending}
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold transition-colors hover:bg-indigo-500 disabled:opacity-50"
          >
            {createQuiz.isPending ? 'Salvataggio...' : 'Salva e continua'}
          </button>
        </form>
      )}

      {quizId && (
        <section className="space-y-4" aria-labelledby="add-question-title">
          <header>
            <h2 id="add-question-title" className="font-semibold text-white">Aggiungi domande</h2>
            <p className="mt-1 text-sm text-gray-400">
              Il quiz è stato creato. Aggiungi le domande una alla volta, poi clicca "Torna ai quiz" quando hai finito.
              {addedQuestions.length > 0 && <span className="ml-1 text-indigo-400">{addedQuestions.length} aggiunt{addedQuestions.length === 1 ? 'a' : 'e'}.</span>}
            </p>
          </header>

          <section className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p>
              <label htmlFor="question-text" className="mb-1 block text-sm text-gray-300">Testo domanda</label>
              <textarea
                id="question-text"
                value={newQuestion.text}
                onChange={e => setNewQuestion(q => ({ ...q, text: e.target.value }))}
                placeholder="Testo domanda"
                rows={2}
                className={fieldClass}
              />
            </p>

            <fieldset className="space-y-2">
              <legend className="mb-1 text-sm text-gray-300">Opzioni risposta</legend>
              {newQuestion.options.map((opt, i) => {
                const optionId = `question-option-${i}`
                return (
                  <p key={optionId} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`${optionId}-correct`}
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => updateOption(i, 'isCorrect', true)}
                      className="shrink-0"
                      aria-label={`Imposta opzione ${i + 1} come corretta`}
                    />
                    <label htmlFor={optionId} className="sr-only">Opzione {i + 1}</label>
                    <input
                      id={optionId}
                      value={opt.text}
                      onChange={e => updateOption(i, 'text', e.target.value)}
                      placeholder={`Opzione ${i + 1}`}
                      className={fieldClass}
                    />
                  </p>
                )
              })}
            </fieldset>

            <p>
              <label htmlFor="question-explanation" className="mb-1 block text-sm text-gray-300">Spiegazione</label>
              <input
                id="question-explanation"
                value={newQuestion.explanation}
                onChange={e => setNewQuestion(q => ({ ...q, explanation: e.target.value }))}
                placeholder="Spiegazione opzionale"
                className={fieldClass}
              />
            </p>

            <button
              type="button"
              onClick={onAddQuestion}
              disabled={addQuestion.isPending}
              aria-busy={addQuestion.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              <Plus size={14} aria-hidden="true" /> Aggiungi domanda
            </button>
          </section>

          {addedQuestions.length > 0 && (
            <section aria-labelledby="added-questions-title">
              <h3 id="added-questions-title" className="sr-only">Domande aggiunte</h3>
              <ol className="space-y-2">
                {addedQuestions.map((q, i) => (
                  <li key={`${q.text}-${i}`} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm">
                    <span className="w-5 shrink-0 text-gray-400">{i + 1}.</span>
                    <span className="line-clamp-1 flex-1">{q.text}</span>
                    <span className="text-xs text-gray-500">{q.options.filter(o => o.text).length} opzioni</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <footer className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/creator')}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/20"
            >
              Torna ai quiz
            </button>
          </footer>
        </section>
      )}
    </article>
  )
}
