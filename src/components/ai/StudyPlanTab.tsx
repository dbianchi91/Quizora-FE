import { BookOpen, RefreshCw } from 'lucide-react'
import { useStudyPlan, useTriggerStudyPlan } from '@/hooks/useAI'
import { cn } from '@/lib/utils'

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/20 text-red-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  low: 'bg-green-500/20 text-green-300',
}

export default function StudyPlanTab() {
  const { data: plan, isLoading } = useStudyPlan()
  const trigger = useTriggerStudyPlan()

  if (isLoading) return <p className="p-4 text-sm text-gray-400">Caricamento piano...</p>

  return (
    <section className="flex h-full flex-col" aria-labelledby="study-plan-title">
      <header className="flex items-center justify-between border-b border-white/10 p-3">
        <h2 id="study-plan-title" className="text-sm font-medium text-white">Piano di studio</h2>
        <button
          type="button"
          onClick={() => trigger.mutate()}
          disabled={trigger.isPending}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
        >
          <RefreshCw size={12} className={trigger.isPending ? 'animate-spin' : ''} aria-hidden="true" />
          Aggiorna
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-3" aria-live="polite">
        {!plan ? (
          <section className="py-8 text-center">
            <BookOpen className="mx-auto mb-2 text-gray-500" size={32} aria-hidden="true" />
            <p className="mb-3 text-sm text-gray-400">Nessun piano ancora. Genera il tuo piano personalizzato.</p>
            <button
              type="button"
              onClick={() => trigger.mutate()}
              disabled={trigger.isPending}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50"
            >
              Genera piano
            </button>
          </section>
        ) : (
          <>
            <p className="mb-2 text-xs text-gray-500">
              Aggiornato: <time dateTime={plan.generatedAt}>{new Date(plan.generatedAt).toLocaleDateString('it-IT')}</time>
            </p>
            <ol className="space-y-2">
              {plan.topics.map((topic, i) => (
                <li key={`${topic.topic}-${i}`} className="space-y-1 rounded-xl border border-white/5 bg-white/5 p-3">
                  <article>
                    <header className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium text-white">{topic.topic}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs', priorityColors[topic.priority] ?? '')}>
                        {topic.priority}
                      </span>
                    </header>
                    <p className="mt-1 text-xs text-gray-400">{topic.description}</p>
                  </article>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
    </section>
  )
}
