import { Link } from 'react-router-dom'
import { BookOpen, Clock, HelpCircle } from 'lucide-react'
import Badge from './Badge'
import type { QuizListItemDto } from '@/types/quiz'

export default function QuizCard({ quiz }: { quiz: QuizListItemDto }) {
  return (
    <article className="h-full overflow-hidden rounded-xl border border-white/5 bg-gray-900 transition-all hover:border-indigo-500/50 hover:scale-[1.02]">
      <Link to={`/quiz/${quiz.id}`} className="group flex h-full flex-col focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <figure className="grid h-32 place-items-center bg-gradient-to-br from-indigo-600/30 to-purple-600/30" aria-hidden="true">
          <BookOpen size={40} className="text-indigo-200" />
        </figure>

        <section className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
            {quiz.title}
          </h3>

          <ul className="flex flex-wrap gap-2" aria-label="Categoria e difficolta">
            <li><Badge label={quiz.difficulty} /></li>
            <li><Badge label={quiz.categoryName} /></li>
          </ul>

          <ul className="mt-auto flex items-center gap-3 text-xs text-gray-400" aria-label="Dettagli quiz">
            <li className="flex items-center gap-1">
              <HelpCircle size={12} aria-hidden="true" /> {quiz.questionCount} q
            </li>
            {quiz.estimatedMinutes > 0 && (
              <li className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" /> {quiz.estimatedMinutes}m
              </li>
            )}
          </ul>
        </section>
      </Link>
    </article>
  )
}
