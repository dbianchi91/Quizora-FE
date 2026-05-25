import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { useMyStats, useMyCategoryStats, useMyHistory } from '@/hooks/useAnalytics'
import Skeleton from '@/components/ui/Skeleton'

function fmt(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <article className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <span className="rounded-xl bg-indigo-500/20 p-3 text-indigo-400" aria-hidden="true">
        <Icon size={20} />
      </span>
      <p>
        <span className="block text-xs text-gray-400">{label}</span>
        <strong className="block text-xl text-white">{value}</strong>
      </p>
    </article>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats } = useMyStats()
  const { data: categories } = useMyCategoryStats()
  const { data: history } = useMyHistory(1, 5)

  const radarData = categories?.map(c => ({
    subject: c.categoryName,
    score: Math.round(c.averageScore),
  })) ?? []

  if (loadingStats) return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12" aria-label="Caricamento dashboard">
      <Skeleton className="mb-4 h-8 w-1/3" />
      <section className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
        {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </section>
      <Skeleton className="h-64 w-full" />
    </section>
  )

  if (!stats) return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-400 sm:px-6" aria-live="polite">
      <p>Nessuna statistica ancora. Completa qualche simulazione per cominciare!</p>
    </section>
  )

  const accuracy = stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="dashboard-title">
      <header>
        <h1 id="dashboard-title" className="text-2xl font-bold text-white">La mia dashboard</h1>
      </header>

      <section aria-label="Statistiche principali">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <li><StatCard label="Simulazioni totali" value={String(stats.totalExams)} icon={BookOpen} /></li>
          <li><StatCard label="Punteggio migliore" value={`${stats.bestScore.toFixed(0)} / 100`} icon={Star} /></li>
          <li><StatCard label="Media" value={`${stats.averageScore.toFixed(0)} / 100`} icon={CheckCircle} /></li>
          <li><StatCard label="Tempo totale" value={fmt(stats.totalTimeSpentSeconds)} icon={Clock} /></li>
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5" aria-labelledby="accuracy-title">
        <header className="mb-2 flex justify-between text-sm">
          <h2 id="accuracy-title" className="text-gray-400">Accuratezza risposte</h2>
          <strong className="font-semibold text-white">{accuracy}%</strong>
        </header>
        <meter className="sr-only" min={0} max={100} value={accuracy}>{accuracy}%</meter>
        <span
          className="block h-2 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={accuracy}
          aria-label="Accuratezza risposte"
        >
          <span
            className="block h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${accuracy}%` }}
          />
        </span>
        <p className="mt-1 text-xs text-gray-500">
          {stats.totalCorrect} corrette su {stats.totalAnswered} risposte date
        </p>
      </section>

      {radarData.length > 0 && (
        <figure className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <figcaption className="mb-4 text-sm font-semibold text-white">Performance per categoria</figcaption>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Radar dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                formatter={(v) => [`${v} / 100`, 'Media']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </figure>
      )}

      {categories && categories.length > 0 && (
        <section aria-labelledby="categories-title">
          <h2 id="categories-title" className="mb-2 font-semibold text-white">Categorie</h2>
          <ul className="space-y-2">
            {categories.map(c => (
              <li key={c.categoryId} className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/5 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span>{c.categoryName}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{c.totalExams} simulazioni</span>
                  <strong className="font-mono font-semibold text-indigo-300">{c.averageScore.toFixed(0)}</strong>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {history && history.items.length > 0 && (
        <section aria-labelledby="history-title">
          <h2 id="history-title" className="mb-2 font-semibold text-white">Ultime simulazioni</h2>
          <ol className="space-y-2">
            {history.items.map(h => (
              <li key={h.sessionId} className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <p>
                  <span className="block font-medium">{h.quizTitle ?? 'Quiz'}</span>
                  <time className="block text-xs text-gray-500" dateTime={h.completedAt}>
                    {new Date(h.completedAt).toLocaleString('it-IT')}
                  </time>
                </p>
                <strong className="font-mono font-semibold text-indigo-300">{h.normalizedScore.toFixed(0)} / 100</strong>
              </li>
            ))}
          </ol>
        </section>
      )}
    </article>
  )
}
