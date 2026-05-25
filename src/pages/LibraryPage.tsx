import { useState } from 'react'
import { Search } from 'lucide-react'
import { useQuizzes } from '@/hooks/useQuizzes'
import QuizCard from '@/components/ui/QuizCard'
import Skeleton from '@/components/ui/Skeleton'

export default function LibraryPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuizzes({ search: search || undefined, pageSize: 50 })
  const quizzes = data?.items ?? []

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6" aria-labelledby="library-title">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 id="library-title" className="text-2xl font-bold text-white">Libreria Quiz</h1>

        <search className="relative w-full sm:max-w-sm">
          <label htmlFor="quiz-search" className="sr-only">Cerca quiz</label>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
          <input
            id="quiz-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca quiz..."
            className="w-full rounded-lg border border-white/10 bg-white/10 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </search>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Quiz disponibili">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-52 w-full" />
            </li>
          ))
          : quizzes.map(q => (
            <li key={q.id}>
              <QuizCard quiz={q} />
            </li>
          ))
        }
      </ul>
    </section>
  )
}
