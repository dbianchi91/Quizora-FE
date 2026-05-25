import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { cn } from '@/lib/utils'
import type { ExamResultDto } from '@/types/exam'

interface Props { result: ExamResultDto }

export default function ResultsCharts({ result }: Props) {
  const correctCount = result.questions.filter(q => q.isCorrect).length
  const wrongCount = result.questions.filter(q => !q.isCorrect && q.selectedOptionId).length
  const skippedCount = result.questions.filter(q => !q.selectedOptionId).length

  const pieData = [
    { name: 'Corrette', value: correctCount, color: '#22c55e' },
    { name: 'Errate', value: wrongCount, color: '#ef4444' },
    { name: 'Non date', value: skippedCount, color: '#6b7280' },
  ].filter(d => d.value > 0)

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="Grafici risultati">
      <figure className="rounded-xl border border-white/10 bg-white/5 p-4">
        <figcaption className="mb-3 text-sm font-semibold text-gray-300">Distribuzione risposte</figcaption>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
            <Legend iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </figure>

      <section className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4" aria-labelledby="final-score-title">
        <p id="final-score-title" className="text-sm text-gray-400">Punteggio finale</p>
        <strong className={cn('text-6xl font-bold', result.score >= 60 ? 'text-green-400' : 'text-red-400')}>
          {result.score.toFixed(0)}
        </strong>
        <p className="text-sm text-gray-500">/ 100</p>
        {result.rank && (
          <p className="mt-2 text-xs text-gray-400">Posizione: #{result.rank} su {result.totalParticipants}</p>
        )}
      </section>
    </section>
  )
}
