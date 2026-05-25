import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useFeaturedQuizzes, useQuizzes, useRecentQuizzes } from '@/hooks/useQuizzes'
import QuizCarousel from '@/components/ui/QuizCarousel'

export default function HomePage() {
  const user = useAuthStore((s) => s.user)
  const { data: featured, isLoading: featuredLoading } = useFeaturedQuizzes()
  const { data: recent, isLoading: recentLoading } = useRecentQuizzes()
  const { data: allQuizzes, isLoading: allLoading } = useQuizzes({ pageSize: 20 })

  return (
    <section className="min-h-screen bg-gray-950 text-white" aria-labelledby="home-title">
      <header className="relative flex min-h-72 items-end bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-950 px-4 pb-8 sm:px-6">
        <section className="relative z-10 max-w-2xl">
          <p className="mb-1 text-sm text-gray-300">Benvenuto, {user?.userName}</p>
          <h1 id="home-title" className="mb-3 text-3xl font-bold">Cosa vuoi studiare oggi?</h1>
          <Link to="/library" className="inline-flex rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold transition-colors hover:bg-indigo-500">
            Esplora quiz
          </Link>
        </section>
      </header>

      <section className="space-y-2 py-4" aria-label="Raccolte quiz">
        <QuizCarousel title="In evidenza" quizzes={featured} isLoading={featuredLoading} />
        <QuizCarousel title="Aggiunti di recente" quizzes={recent} isLoading={recentLoading} />
        <QuizCarousel title="Tutti i quiz" quizzes={allQuizzes?.items} isLoading={allLoading} />
      </section>
    </section>
  )
}
