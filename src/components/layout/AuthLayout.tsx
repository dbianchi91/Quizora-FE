import { Outlet } from 'react-router-dom'
import quizoraLogo from '@/assets/quizora_logo.png'

export function AuthLayout() {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-950 px-4 py-10 text-white">
      <section
        className="w-full max-w-md rounded-xl border border-white/10 bg-gray-900 p-6 shadow-2xl sm:p-8"
        aria-labelledby="auth-title"
      >
        <header className="mb-8 text-center">
          <h1 id="auth-title" className="flex justify-center">
            <img src={quizoraLogo} alt="Quizora" className="h-28 w-28 object-contain sm:h-32 sm:w-32" />
          </h1>
        </header>
        <Outlet />
      </section>
    </main>
  )
}
