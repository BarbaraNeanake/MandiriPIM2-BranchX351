import { Fragment } from 'react'
import { Link } from 'react-router-dom'

const STEPS = [
  { to: '/database', page: 'Database', action: 'Isi & ubah data di' },
  { to: '/peta', page: 'Peta', action: 'Lihat sebaran di' },
  { to: '/pipeline', page: 'Pipeline', action: 'Geser status di' },
  { to: '/aktivitas', page: 'Log Aktivitas', action: 'Catat kunjungan & NTB di' },
]

/** Panduan singkat alur kerja, satu baris. */
export default function UsageGuide() {
  return (
    <section className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-line bg-white px-4 py-2.5 text-xs text-navy-500">
      <span className="rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-800">
        Cara pakai
      </span>
      {STEPS.map((s, i) => (
        <Fragment key={s.to}>
          {i > 0 && (
            <span className="text-navy-200" aria-hidden>
              &rarr;
            </span>
          )}
          <span>
            <span className="mr-1 font-semibold tabular-nums text-navy-300">{i + 1}.</span>
            {s.action}{' '}
            <Link to={s.to} className="font-semibold text-navy-700 hover:underline">
              {s.page}
            </Link>
          </span>
        </Fragment>
      ))}
    </section>
  )
}
