import { useMemo, useState } from 'react'
import MapView, { type MapPin } from '../components/MapView'
import CommunityDetail from '../components/CommunityDetail'
import CommunityForm from '../components/CommunityForm'
import { EmptyState } from '../components/ui'
import {
  BRANCH,
  CATEGORIES,
  CATEGORY_LABEL,
  RADIUS_BANDS,
  RADIUS_BAND_LABEL,
  RADIUS_RINGS,
  STATUSES,
  STATUS_COLOR,
  STATUS_LABEL,
} from '../lib/constants'
import { formatDistance } from '../lib/geo'
import { useData } from '../state/DataContext'
import type { Category, Community, RadiusBand, Status } from '../types'

function FilterChips<T extends string>({
  options,
  labels,
  selected,
  onToggle,
  colors,
}: {
  options: T[]
  labels: Record<T, string>
  selected: Set<T>
  onToggle: (value: T) => void
  colors?: Record<T, string>
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const on = selected.has(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            aria-pressed={on}
            className={
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ' +
              'ring-1 ring-inset transition ' +
              (on
                ? 'bg-navy text-white ring-navy'
                : 'bg-white text-navy-500 ring-navy-200 hover:bg-navy-50')
            }
          >
            {colors ? (
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: colors[opt] }}
                aria-hidden
              />
            ) : null}
            {labels[opt]}
          </button>
        )
      })}
    </div>
  )
}

export default function CommunityMap() {
  const { communities, editCommunity } = useData()
  const [categories, setCategories] = useState<Set<Category>>(new Set())
  const [statuses, setStatuses] = useState<Set<Status>>(new Set())
  const [bands, setBands] = useState<Set<RadiusBand>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Community | null>(null)

  const toggle = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>) => (value: T) =>
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })

  const filtered = useMemo(
    () =>
      communities.filter(
        (c) =>
          (categories.size === 0 || categories.has(c.category)) &&
          (statuses.size === 0 || statuses.has(c.status)) &&
          (bands.size === 0 || bands.has(c.radius_band)),
      ),
    [communities, categories, statuses, bands],
  )

  const pins: MapPin[] = useMemo(
    () =>
      filtered.map((c) => ({
        id: c.id,
        lat: c.lat,
        lng: c.lng,
        color: STATUS_COLOR[c.status],
        title: c.name,
        subtitle: CATEGORY_LABEL[c.category] + ' - ' + formatDistance(c.distance_km),
      })),
    [filtered],
  )

  const selected = communities.find((c) => c.id === selectedId) ?? null
  const activeFilters = categories.size + statuses.size + bands.size

  return (
    <div className="space-y-4">
      <section className="card p-3">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <div>
            <span className="label">Kategori</span>
            <FilterChips
              options={CATEGORIES}
              labels={CATEGORY_LABEL}
              selected={categories}
              onToggle={toggle(setCategories)}
            />
          </div>
          <div>
            <span className="label">Status</span>
            <FilterChips
              options={STATUSES}
              labels={STATUS_LABEL}
              selected={statuses}
              onToggle={toggle(setStatuses)}
              colors={STATUS_COLOR}
            />
          </div>
          <div>
            <span className="label">Radius</span>
            <FilterChips
              options={RADIUS_BANDS}
              labels={RADIUS_BAND_LABEL}
              selected={bands}
              onToggle={toggle(setBands)}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-navy-50 pt-2">
          <p className="text-xs text-navy-400">
            Menampilkan <b className="text-navy">{filtered.length}</b> dari {communities.length}{' '}
            komunitas.
          </p>
          {activeFilters > 0 && (
            <button
              type="button"
              className="text-xs font-semibold text-navy-400 underline-offset-2 hover:text-navy hover:underline"
              onClick={() => {
                setCategories(new Set())
                setStatuses(new Set())
                setBands(new Set())
              }}
            >
              Hapus {activeFilters} filter
            </button>
          )}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="card overflow-hidden">
          <div className="h-[420px] w-full sm:h-[560px]">
            <MapView
              center={BRANCH}
              zoom={13}
              fitRadiusM={5000}
              pins={pins}
              rings={RADIUS_RINGS.map((r) => ({ ...r }))}
              origin={{ lat: BRANCH.lat, lng: BRANCH.lng, label: BRANCH.name }}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-navy-100 px-3 py-2 text-[11px] text-navy-500">
            <span className="flex items-center gap-1.5 font-semibold text-navy">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-navy text-[9px] font-black text-gold">
                M
              </span>
              {BRANCH.name}
            </span>
            {STATUSES.map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-white"
                  style={{ background: STATUS_COLOR[s] }}
                  aria-hidden
                />
                {STATUS_LABEL[s]}
              </span>
            ))}
            {RADIUS_RINGS.map((r) => (
              <span key={r.radiusM} className="flex items-center gap-1.5">
                <span
                  className="h-0 w-4 border-t-2 border-dashed"
                  style={{ borderColor: r.color }}
                  aria-hidden
                />
                Radius {r.label}
              </span>
            ))}
          </div>
        </div>

        <div className="card min-h-[320px] xl:h-[606px]">
          {selected ? (
            <CommunityDetail
              community={selected}
              onEdit={setEditing}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex h-full flex-col">
              <header className="border-b border-navy-100 px-4 py-3">
                <h2 className="text-sm font-bold text-navy">Prioritas teratas</h2>
                <p className="mt-0.5 text-[11px] text-navy-400">
                  Klik marker di peta atau baris di bawah untuk membuka detail.
                </p>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <EmptyState
                    title="Tidak ada komunitas yang cocok"
                    hint="Longgarkan filter di atas."
                  />
                ) : (
                  <ul className="space-y-1">
                    {filtered.slice(0, 20).map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(c.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-navy-50"
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: STATUS_COLOR[c.status] }}
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-navy-700">
                              {c.name}
                            </span>
                            <span className="block text-[11px] text-navy-300">
                              {CATEGORY_LABEL[c.category]} - {formatDistance(c.distance_km)} -{' '}
                              {STATUS_LABEL[c.status]}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <CommunityForm
        open={editing !== null}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(draft) => editCommunity(editing!.id, draft)}
      />
    </div>
  )
}
