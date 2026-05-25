import { useId, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import QuizCard from './QuizCard'
import Skeleton from './Skeleton'
import type { QuizListItemDto } from '@/types/quiz'

interface Props { title: string; quizzes?: QuizListItemDto[]; isLoading?: boolean }

export default function QuizCarousel({ title, quizzes, isLoading }: Props) {
  const titleId = useId()
  const ref = useRef<HTMLUListElement>(null)
  const visibleQuizzes = quizzes ?? []
  const shouldHide = !isLoading && visibleQuizzes.length === 0
  const scroll = (dir: 'left' | 'right') =>
    ref.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })

  if (shouldHide) return null

  return (
    <section className="py-4" aria-labelledby={titleId}>
      <header className="mb-3 flex items-center justify-between px-4 sm:px-6">
        <h2 id={titleId} className="text-lg font-semibold text-white">{title}</h2>
        <nav className="flex gap-1" aria-label={`Scorri ${title}`}>
          <button
            type="button"
            onClick={() => scroll('left')}
            className="rounded-full p-1 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Scorri a sinistra"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="rounded-full p-1 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Scorri a destra"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </nav>
      </header>

      <ul ref={ref} className="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth sm:px-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="w-64 shrink-0">
              <Skeleton className="h-52 w-full" />
            </li>
          ))
          : visibleQuizzes.map(q => (
            <li key={q.id} className="w-64 shrink-0">
              <QuizCard quiz={q} />
            </li>
          ))
        }
      </ul>
    </section>
  )
}
