import type { ReactNode } from 'react'
import type { Category, Potential, Status } from '../types'
import {
  CATEGORY_LABEL,
  POTENTIAL_LABEL,
  STATUS_CHIP,
  STATUS_COLOR,
  STATUS_LABEL,
} from '../lib/constants'

export function StatusChip({ status }: { status: Status }) {
  return (
    <span className={'chip ' + STATUS_CHIP[status]}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: STATUS_COLOR[status] }}
        aria-hidden
      />
      {STATUS_LABEL[status]}
    </span>
  )
}

export function CategoryChip({ category }: { category: Category }) {
  return (
    <span className="chip bg-navy-50 text-navy-600 ring-navy-100">{CATEGORY_LABEL[category]}</span>
  )
}

export function PotentialChip({ potential }: { potential: Potential | null }) {
  if (!potential) return <span className="text-xs text-navy-300">Belum dinilai</span>
  const tone =
    potential === 'high'
      ? 'bg-emerald-50 text-success ring-emerald-200'
      : potential === 'medium'
        ? 'bg-gold-50 text-gold-600 ring-gold-200'
        : 'bg-navy-50 text-navy-400 ring-navy-200'
  return <span className={'chip ' + tone}>{POTENTIAL_LABEL[potential]}</span>
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={'card ' + (className ?? '')}>
      <header className="flex items-center justify-between gap-3 px-5 pb-1 pt-4">
        <h2 className="text-[15px] font-semibold text-navy-800">{title}</h2>
        {action}
      </header>
      <div className="px-5 pb-5 pt-3">{children}</div>
    </section>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-navy-100 bg-canvas px-4 py-8 text-center">
      <p className="text-sm font-semibold text-navy-500">{title}</p>
      {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
    </div>
  )
}

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-navy-900/50 p-4 sm:p-8">
      <div
        className={
          'w-full rounded-xl bg-white shadow-pop ' + (wide ? 'max-w-3xl' : 'max-w-lg')
        }
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="flex items-center justify-between border-b border-navy-100 px-5 py-3">
          <h2 className="text-[15px] font-semibold text-navy-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-navy-300 transition hover:bg-navy-50 hover:text-navy"
            aria-label="Tutup"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <span className="label">{label}</span>
      {children}
      {hint && <p className="mt-1 text-[11px] text-navy-300">{hint}</p>}
    </div>
  )
}
