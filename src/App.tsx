import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import AppLayout from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import RoleGuard from '@/components/layout/RoleGuard'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const QuizDetailPage = lazy(() => import('@/pages/QuizDetailPage'))
const ExamPage = lazy(() => import('@/pages/ExamPage'))
const ResultsPage = lazy(() => import('@/pages/ResultsPage'))
const LibraryPage = lazy(() => import('@/pages/LibraryPage'))
const CreatorPage = lazy(() => import('@/pages/creator/CreatorPage'))
const QuizEditorPage = lazy(() => import('@/pages/creator/QuizEditorPage'))
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'))
const SimulationsPage = lazy(() => import('@/pages/SimulationsPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'))

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.accessToken)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

const Loading = () => (
  <main className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400" aria-live="polite">
    Caricamento...
  </main>
)

export default function App() {
  const token = useAuthStore((s) => s.accessToken)
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    if (!token) return
    authApi.getMe().then(setUser).catch(() => {})
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/exam/:sessionId" element={
          <PrivateRoute><ExamPage /></PrivateRoute>
        } />

        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/quiz/:id" element={<QuizDetailPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
          <Route path="/creator" element={
            <RoleGuard role="creator"><CreatorPage /></RoleGuard>
          } />
          <Route path="/creator/quiz/new" element={
            <RoleGuard role="creator"><QuizEditorPage /></RoleGuard>
          } />
          <Route path="/creator/quiz/:id/edit" element={
            <RoleGuard role="creator"><QuizEditorPage /></RoleGuard>
          } />
          <Route path="/simulations/:quizId" element={<SimulationsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={
            <RoleGuard role="admin"><AdminPage /></RoleGuard>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
