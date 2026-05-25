import { useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useSimulationHistory } from '@/hooks/useExam'
import { useQuizDetail } from '@/hooks/useQuizzes'
import Skeleton from '@/components/ui/Skeleton'

export default function SimulationsPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const { data: quiz } = useQuizDetail(quizId!)
  const { data: history, isLoading } = useSimulationHistory(quizId!)

  const chartData = history?.map((h, i) => ({
    attempt: i + 1,
    score: h.score,
    date: new Date(h.completedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
  }))

  if (isLoading) return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12" aria-label="Caricamento simulazioni">
      <Skeleton className="mb-4 h-8 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </section>
  )

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="simulations-title">
      <header className="mb-6">
        <h1 id="simulations-title" className="text-2xl font-bold text-white">Storico simulazioni</h1>
        {quiz && <p className="mt-2 text-gray-400">{quiz.title}</p>}
      </header>

      {chartData && chartData.length > 0 ? (
        <figure className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <figcaption className="mb-4 text-sm font-semibold text-white">Andamento punteggio</figcaption>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                formatter={(v) => [typeof v === 'number' ? v.toFixed(0) : '0', 'Punteggio']}
              />
              <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2} dot={{ r: 4, fill: '#818cf8' }} />
            </LineChart>
          </ResponsiveContainer>
        </figure>
      ) : (
        <p className="text-gray-400">Nessuna simulazione ancora. Completa qualche simulazione per vedere le statistiche.</p>
      )}

      {history && history.length > 0 && (
        <section className="mt-6" aria-labelledby="attempts-title">
          <h2 id="attempts-title" className="sr-only">Tentativi completati</h2>
          <ol className="space-y-2">
            {history.map((h) => (
              <li key={h.sessionId} className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/5 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <time className="text-gray-400" dateTime={h.completedAt}>
                  {new Date(h.completedAt).toLocaleString('it-IT')}
                </time>
                <span className="font-mono font-semibold text-indigo-300">{h.score.toFixed(0)} / 100</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  )
}
