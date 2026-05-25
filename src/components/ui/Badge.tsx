import { cn } from '@/lib/utils'

const variants: Record<string, string> = {
  Easy: 'bg-green-500/20 text-green-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Hard: 'bg-red-500/20 text-red-400',
  default: 'bg-white/10 text-gray-300',
}

export default function Badge({ label, variant }: { label: string; variant?: string }) {
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', variants[variant ?? label] ?? variants.default)}>
      {label}
    </span>
  )
}
