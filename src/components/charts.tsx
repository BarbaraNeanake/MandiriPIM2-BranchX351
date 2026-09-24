/**
 * Grafik ringan berbasis div - tanpa pustaka chart.
 * Semua bar diberi label langsung (angka + nama tahap) sehingga identitas tidak
 * pernah bergantung pada warna saja.
 */

export interface BarDatum {
  key: string
  label: string
  value: number
  color: string
  /** Teks tambahan di sebelah kanan, mis. persentase konversi. */
  note?: string
}

export function BarList({
  data,
  max,
  valueSuffix,
  emptyLabel = 'Belum ada data',
}: {
  data: BarDatum[]
  max?: number
  valueSuffix?: string
  emptyLabel?: string
}) {
  const peak = Math.max(1, max ?? Math.max(...data.map((d) => d.value), 0))
  if (!data.length) return <p className="text-xs text-navy-300">{emptyLabel}</p>

  return (
    <ul className="space-y-3">
      {data.map((d) => {
        const pct = Math.round((d.value / peak) * 100)
        return (
          <li key={d.key} className="grid grid-cols-[minmax(6.5rem,9rem)_1fr] items-center gap-3">
            <span className="truncate text-xs font-medium text-navy-600" title={d.label}>
              {d.label}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-navy-50"
                title={d.label + ': ' + d.value + (valueSuffix ? ' ' + valueSuffix : '')}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: Math.max(d.value > 0 ? 2 : 0, pct) + '%', background: d.color }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-xs font-bold tabular-nums text-navy">
                {d.value.toLocaleString('id-ID')}
              </span>
              {d.note !== undefined && (
                <span className="w-12 shrink-0 text-right text-[11px] tabular-nums text-navy-300">
                  {d.note}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export interface KpiItem {
  label: string
  value: string
  sub?: string
  /** Sorot angka dengan warna kuning (dipakai untuk metrik hasil, mis. NTB). */
  highlight?: boolean
}

/** Panel KPI berlatar navy: satu angka besar per metrik, tanpa plot. */
export function KpiPanel({ title, items }: { title: string; items: KpiItem[] }) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-navy-700 text-white shadow-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-gold" aria-hidden />
      <p className="px-5 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-300 sm:px-6">
        {title}
      </p>
      {/* gap-px di atas latar putih transparan = garis pemisah antarsel di semua lebar layar. */}
      <dl
        className={
          'mt-4 grid gap-px border-t border-white/10 bg-white/10 ' +
          (items.length === 3 ? 'sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4')
        }
      >
        {items.map((item) => (
          <div key={item.label} className="bg-navy-700 px-5 pb-5 pt-4 sm:px-6">
            <dt className="text-xs font-medium text-navy-200">{item.label}</dt>
            <dd
              className={
                'mt-2 text-[30px] font-semibold tabular-nums leading-none tracking-tight ' +
                (item.highlight ? 'text-gold' : 'text-white')
              }
            >
              {item.value}
            </dd>
            {item.sub && <dd className="mt-2 text-xs leading-snug text-navy-200/80">{item.sub}</dd>}
          </div>
        ))}
      </dl>
    </section>
  )
}
