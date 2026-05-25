interface LeaderboardEntry { rank: number; userName: string; score: number }
interface Props { entries: LeaderboardEntry[]; currentUserName: string }

export default function LeaderboardTable({ entries, currentUserName }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-white/5" aria-labelledby="leaderboard-table-title">
      <header className="border-b border-white/10 px-4 py-3">
        <h3 id="leaderboard-table-title" className="text-sm font-semibold text-white">Classifica</h3>
      </header>
      <table className="w-full text-sm">
        <caption className="sr-only">Classifica punteggi quiz</caption>
        <thead className="bg-white/5 text-xs text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-2 text-left">#</th>
            <th scope="col" className="px-4 py-2 text-left">Utente</th>
            <th scope="col" className="px-4 py-2 text-right">Punteggio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {entries.map(entry => (
            <tr key={entry.rank} className={entry.userName === currentUserName ? 'bg-indigo-500/10' : 'hover:bg-white/5'}>
              <td className="px-4 py-2.5 text-gray-400">{entry.rank}</td>
              <th scope="row" className="px-4 py-2.5 text-left font-medium text-white">{entry.userName}</th>
              <td className="px-4 py-2.5 text-right font-mono text-indigo-300">{entry.score.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
