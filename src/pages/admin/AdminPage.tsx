import { useState } from 'react'
import { useAdminUsers, useAssignCreator } from '@/hooks/useAdmin'
import { useAdminOverview } from '@/hooks/useAnalytics'
import { useAuthStore } from '@/store/authStore'
import Skeleton from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <p className="text-xs text-gray-400">{label}</p>
      <strong className="mt-1 block text-2xl text-white">{value}</strong>
    </article>
  )
}

export default function AdminPage() {
  const [page, setPage] = useState(1)
  const currentUser = useAuthStore((s) => s.user)
  const { data: rawData, isLoading } = useAdminUsers(page)
  const users = Array.isArray(rawData) ? rawData : (rawData?.items ?? [])
  const totalCount = Array.isArray(rawData) ? rawData.length : (rawData?.totalCount ?? 0)
  const toggleCreator = useAssignCreator()
  const { data: overview } = useAdminOverview()

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-10" aria-labelledby="admin-title">
      <header>
        <h1 id="admin-title" className="text-2xl font-bold text-white">Admin</h1>
      </header>

      {overview && (
        <section aria-label="Panoramica piattaforma">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <li><OverviewCard label="Utenti attivi" value={String(overview.totalActiveUsers)} /></li>
            <li><OverviewCard label="Simulazioni totali" value={String(overview.totalExamsAllTime)} /></li>
            <li><OverviewCard label="Simulazioni oggi" value={String(overview.examsToday)} /></li>
            <li><OverviewCard label="Media globale" value={`${(overview.globalAverageScore ?? 0).toFixed(0)} / 100`} /></li>
          </ul>
        </section>
      )}

      <section aria-labelledby="users-title">
        <h2 id="users-title" className="mb-4 text-lg font-semibold text-white">Gestione utenti</h2>

        {isLoading ? (
          <section className="space-y-2" aria-label="Caricamento utenti">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <table className="w-full text-sm">
              <caption className="sr-only">Elenco utenti e permessi creator</caption>
              <thead className="bg-white/5 text-xs text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Utente</th>
                  <th scope="col" className="hidden px-4 py-3 text-left sm:table-cell">Email</th>
                  <th scope="col" className="px-4 py-3 text-center">Ruolo</th>
                  <th scope="col" className="px-4 py-3 text-center">Creator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(user => (
                  <tr key={user.id} className="transition-colors hover:bg-white/5">
                    <th scope="row" className="px-4 py-3 text-left font-medium text-white">
                      {user.userName}
                      {user.id === currentUser?.id && <span className="ml-2 text-xs text-indigo-400">(tu)</span>}
                      <span className="mt-1 block text-xs font-normal text-gray-500 sm:hidden">{user.email}</span>
                    </th>
                    <td className="hidden px-4 py-3 text-gray-400 sm:table-cell">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      {user.isAdmin ? <Badge label="Admin" variant="Hard" /> :
                       user.isCreator ? <Badge label="Creator" variant="Medium" /> :
                       <Badge label="Student" variant="Easy" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!user.isAdmin && (
                        <button
                          type="button"
                          onClick={() => toggleCreator.mutate({ userId: user.id, assign: !user.isCreator })}
                          disabled={toggleCreator.isPending}
                          aria-label={`${user.isCreator ? 'Revoca' : 'Assegna'} ruolo creator a ${user.userName}`}
                          className={cn(
                            'rounded-lg px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50',
                            user.isCreator
                              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30',
                          )}
                        >
                          {user.isCreator ? 'Revoca' : 'Assegna'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {totalCount > 20 && (
          <nav className="mt-4 flex justify-center gap-2" aria-label="Paginazione utenti">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm transition-colors hover:bg-white/20 disabled:opacity-30"
            >
              Precedente
            </button>
            <span className="px-3 py-1 text-sm text-gray-400" aria-current="page">Pagina {page}</span>
            <button
              type="button"
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= totalCount}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm transition-colors hover:bg-white/20 disabled:opacity-30"
            >
              Successiva
            </button>
          </nav>
        )}
      </section>
    </article>
  )
}
