import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const emailErrorId = errors.email ? 'login-email-error' : undefined
  const passwordErrorId = errors.password ? 'login-password-error' : undefined

  return (
    <section aria-labelledby="login-title">
      <header className="mb-6">
        <h2 id="login-title" className="mb-1 text-xl font-semibold text-white">Sign in</h2>
        <p className="text-sm text-gray-400">Welcome back to Quizora</p>
      </header>

      <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
        <fieldset className="space-y-4" disabled={login.isPending}>
          <p>
            <label className="block text-sm font-medium text-gray-300" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={emailErrorId}
              {...register('email')}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
            {errors.email && <span id="login-email-error" className="mt-1 block text-xs text-red-400">{errors.email.message}</span>}
          </p>

          <p>
            <label className="block text-sm font-medium text-gray-300" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={passwordErrorId}
              {...register('password')}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
            {errors.password && <span id="login-password-error" className="mt-1 block text-xs text-red-400">{errors.password.message}</span>}
          </p>
        </fieldset>

        {login.error && (
          <p className="text-center text-sm text-red-400" role="alert">Email o password non validi.</p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          aria-busy={login.isPending}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {login.isPending ? 'Accesso...' : 'Accedi'}
        </button>

        <p className="text-center text-sm text-gray-400">
          Non hai un account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">Registrati</Link>
        </p>
      </form>
    </section>
  )
}
