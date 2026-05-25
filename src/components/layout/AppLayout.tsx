import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { BarChart2, BookOpen, Home, LayoutDashboard, LogOut, Shield, Trophy } from 'lucide-react'
import AITutorBubble from '@/components/ai/AITutorBubble'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const handleLogout = () => { clearAuth(); navigate('/login') }
  const linkClass = ({ isActive }: { isActive: boolean }) => cn(
    'inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm transition-colors',
    isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-gray-950/90 backdrop-blur">
        <nav className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center gap-2 px-4 py-2 sm:px-6" aria-label="Navigazione principale">
          <NavLink to="/" className="mr-auto text-xl font-bold text-indigo-400">
            Quizora
          </NavLink>
          <ul className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto sm:overflow-visible">
            <li>
              <NavLink to="/" className={linkClass} end>
                <Home size={16} aria-hidden="true" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/library" className={linkClass}>
                <BookOpen size={16} aria-hidden="true" /> Library
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={linkClass}>
                <BarChart2 size={16} aria-hidden="true" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/leaderboard" className={linkClass}>
                <Trophy size={16} aria-hidden="true" /> Classifica
              </NavLink>
            </li>
            {user?.isCreator && (
              <li>
                <NavLink to="/creator" className={linkClass}>
                  <LayoutDashboard size={16} aria-hidden="true" /> Creator
                </NavLink>
              </li>
            )}
            {user?.isAdmin && (
              <li>
                <NavLink to="/admin" className={linkClass}>
                  <Shield size={16} aria-hidden="true" /> Admin
                </NavLink>
              </li>
            )}
          </ul>
          <section className="flex items-center gap-3" aria-label="Account">
            <span className="hidden text-sm text-gray-400 sm:inline">{user?.userName}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Esci"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </section>
        </nav>
      </header>
      <main className="pt-24 sm:pt-16">
        <Outlet />
      </main>
      <AITutorBubble />
    </div>
  )
}
