import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { useLeaderboard } from '@/hooks/useAnalytics'
import { useCategories } from '@/hooks/useQuizzes'
import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

const rankLabel = (rank: number) => `#${rank}`

const medalColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400'
  if (rank === 2) return 'text-gray-300'
  if (rank === 3) return 'text-amber-500'
  return 'text-gray-500'
}

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const { data: categories } = useCategories()
  const { data: leaderboard, isLoading } = useLeaderboard(selectedCategory, 1, 50)

  return (
    <article className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="leaderboard-title">
      <header className="flex items-center gap-3">
        <Trophy size={24} className="text-yellow-400" aria-hidden="true" />
        <h1 id="leaderboard-title" className="text-2xl font-bold text-white">Classifica</h1>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Filtra classifica per categoria">
        <button
          type="button"
          onClick={() => setSelectedCategory(undefined)}
          aria-pressed={!selectedCategory}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm transition-colors',
            !selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20',
          )}
        >
          Globale
        </button>
        {categories?.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            aria-pressed={selectedCategory === c.id}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm transition-colors',
              selectedCategory === c.id ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20',
            )}
          >
            {c.name}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <section className="space-y-2" aria-label="Caricamento classifica">
          {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </section>
      ) : leaderboard && leaderboard.items.length > 0 ? (
        <ol className="space-y-2" aria-label="Risultati classifica">
          {leaderboard.items.map(entry => (
            <li
              key={entry.userId}
              className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <strong className={cn('w-9 text-center text-sm font-bold', medalColor(entry.rank))}>
                <span className="sr-only">Posizione </span>
                {rankLabel(entry.rank)}
              </strong>
              <p className="flex-1">
                <span className="block text-sm font-medium text-white">{entry.userName}</span>
                <span className="block text-xs text-gray-500">{entry.totalExams} simulazioni</span>
              </p>
              <strong className="font-mono font-semibold text-indigo-300">
                {entry.bestScore.toFixed(0)} / 100
              </strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-10 text-center text-gray-400" role="status">
          Nessun risultato. Sii il primo a completare una simulazione!
        </p>
      )}
    </article>
  )
}
