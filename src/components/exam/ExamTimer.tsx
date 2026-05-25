import { useEffect, useRef, useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  expiresAt: string
  serverNow: string
  onExpire: () => void
}

function computeRemaining(expiresAt: string, serverNow: string, fetchedAt: number) {
  const expireMs = new Date(expiresAt).getTime()
  const serverNowMs = new Date(serverNow).getTime()
  const elapsedSinceSync = Date.now() - fetchedAt
  const remainingMs = expireMs - serverNowMs - elapsedSinceSync
  return Math.max(0, Math.floor(remainingMs / 1000))
}

export default function ExamTimer({ expiresAt, serverNow, onExpire }: Props) {
  const [remaining, setRemaining] = useState(() => computeRemaining(expiresAt, serverNow, Date.now()))
  const expiredRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpire()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onExpire])

  const m = Math.floor(remaining / 60).toString().padStart(2, '0')
  const s = (remaining % 60).toString().padStart(2, '0')
  const urgent = remaining < 60

  return (
    <time
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-sm font-semibold',
        urgent ? 'animate-pulse bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-200',
      )}
      dateTime={`PT${remaining}S`}
      aria-label={`${remaining} secondi rimanenti`}
    >
      <Clock size={14} aria-hidden="true" />
      {m}:{s}
    </time>
  )
}
