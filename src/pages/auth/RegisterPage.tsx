import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Invalid email'),
  userName: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores, hyphens'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a digit')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const register_ = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const emailErrorId = errors.email ? 'register-email-error' : undefined
  const userNameErrorId = errors.userName ? 'register-username-error' : undefined
  const passwordErrorId = errors.password ? 'register-password-error' : undefined

  return (
    <section aria-labelledby="register-title">
      <header className="mb-6">
        <h2 id="register-title" className="mb-1 text-xl font-semibold text-white">Crea account</h2>
        <p className="text-sm text-gray-400">Unisciti a Quizora e inizia a studiare</p>
      </header>

      <form onSubmit={handleSubmit((data) => register_.mutate(data))} className="space-y-4">
        <fieldset className="space-y-4" disabled={register_.isPending}>
          <p>
            <label className="block text-sm font-medium text-gray-300" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={emailErrorId}
              {...register('email')}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
            {errors.email && <span id="register-email-error" className="mt-1 block text-xs text-red-400">{errors.email.message}</span>}
          </p>

          <p>
            <label className="block text-sm font-medium text-gray-300" htmlFor="register-username">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              aria-invalid={Boolean(errors.userName)}
              aria-describedby={userNameErrorId}
              {...register('userName')}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your_username"
            />
            {errors.userName && <span id="register-username-error" className="mt-1 block text-xs text-red-400">{errors.userName.message}</span>}
          </p>

          <p>
            <label className="block text-sm font-medium text-gray-300" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={passwordErrorId}
              {...register('password')}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
            {errors.password && <span id="register-password-error" className="mt-1 block text-xs text-red-400">{errors.password.message}</span>}
          </p>
        </fieldset>

        {register_.error && (
          <p className="text-center text-sm text-red-400" role="alert">
            Registrazione fallita. Email gia in uso.
          </p>
        )}

        <button
          type="submit"
          disabled={register_.isPending}
          aria-busy={register_.isPending}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {register_.isPending ? 'Creazione...' : 'Crea account'}
        </button>

        <p className="text-center text-sm text-gray-400">
          Hai gia un account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">Accedi</Link>
        </p>
      </form>
    </section>
  )
}
