import { useEffect, useId, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }

export default function Modal({ isOpen, onClose, title, children }: Props) {
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return undefined
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <aside className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-xl border border-white/10 bg-gray-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Chiudi finestra"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <section className="p-5">{children}</section>
      </section>
    </aside>
  )
}
