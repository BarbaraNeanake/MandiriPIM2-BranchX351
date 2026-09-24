import { useMemo, useState } from 'react'
import CommunityForm from '../components/CommunityForm'
import { EmptyState } from '../components/ui'
import {
  CATEGORIES,
  CATEGORY_LABEL,
  POTENTIALS,
  POTENTIAL_LABEL,
  RADIUS_BANDS,
  RADIUS_BAND_LABEL,
  STATUSES,
  STATUS_CHIP,
  STATUS_LABEL,
} from '../lib/constants'
import { formatDistance } from '../lib/geo'
import { formatDate, formatIdrShort, formatNumber, relativeDay } from '../lib/format'
import { exportToExcel } from '../lib/excel'
import { useData } from '../state/DataContext'
import type { Category, Community, Potential, RadiusBand, Status } from '../types'

type SortKey =
  | 'name'
  | 'category'
  | 'distance_km'
  | 'estimated_members'
  | 'funding_potential_idr'
  | 'status'
  | 'ntb_acquired'
  | 'updated_at'

const COLUMNS: Array<{ key: SortKey | null; label: string; align?: 'right' }> = [
  { key: 'name', label: 'Komunitas' },
  { key: 'category', label: 'Kategori' },
  { key: 'status', label: 'Status' },
  { key: 'distance_km', label: 'Jarak', align: 'right' },
  { key: 'estimated_members', label: 'Anggota', align: 'right' },
  { key: null, label: 'PIC' },
  { key: null, label: 'Potensi usaha' },
  { key: 'funding_potential_idr', label: 'Potensi dana', align: 'right' },
  { key: null, label: 'Produk' },
  { key: null, label: 'Tindakan berikutnya' },
  { key: 'ntb_acquired', label: 'NTB', align: 'right' },
  { key: 'updated_at', label: 'Diperbarui', align: 'right' },
  { key: null, label: '' },
]

/** Input yang menyimpan perubahan saat blur atau Enter. */
function InlineInput({
  value,
  onCommit,
  type = 'text',
  placeholder,
  className,
}: {
  value: string
  onCommit: (next: string) => void
  type?: 'text' | 'number' | 'date'
  placeholder?: string
  className?: string
}) {
  const [draft, setDraft] = useState(value)
  const [focused, setFocused] = useState(false)
  if (!focused && draft !== value) setDraft(value)

  return (
    <input
      type={type}
      value={draft}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        setFocused(false)
        if (draft !== value) onCommit(draft)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          setDraft(value)
          e.currentTarget.blur()
        }
      }}
      className={
        'w-full rounded border border-transparent bg-transparent px-1.5 py-1 text-sm ' +
        'text-navy-700 outline-none transition hover:border-navy-100 hover:bg-navy-50/60 ' +
        'focus:border-navy-300 focus:bg-white focus:ring-2 focus:ring-navy-100 ' +
        (className ?? '')
      }
    />
  )
}

function numOrNull(v: string): number | null {
  const n = Number(v)
  return v.trim() === '' || Number.isNaN(n) ? null : n
}

export default function Database() {
  const { communities, activities, byId, addCommunity, editCommunity, removeCommunity } = useData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [band, setBand] = useState<RadiusBand | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('distance_km')
  const [asc, setAsc] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Community | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = communities.filter((c) => {
      if (category !== 'all' && c.category !== category) return false
      if (status !== 'all' && c.status !== status) return false
      if (band !== 'all' && c.radius_band !== band) return false
      if (!q) return true
      return [c.name, c.address, c.pic_name, c.next_action, c.notes, c.activity_schedule]
        .concat(c.product_opportunity)
        .join(' ')
        .toLowerCase()
        .includes(q)
    })

    const dir = asc ? 1 : -1
    return [...filtered].sort((a, b) => {
      const x = a[sortKey]
      const y = b[sortKey]
      if (typeof x === 'string' && typeof y === 'string') return x.localeCompare(y, 'id') * dir
      const nx = typeof x === 'number' ? x : -1
      const ny = typeof y === 'number' ? y : -1
      return (nx - ny) * dir || a.name.localeCompare(b.name, 'id')
    })
  }, [communities, query, category, status, band, sortKey, asc])

  function sortBy(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v)
    else {
      setSortKey(key)
      setAsc(key === 'name' || key === 'category')
    }
  }

  const [exporting, setExporting] = useState(false)

  /** Ekspor mengikuti filter & urutan yang sedang aktif, plus aktivitas komunitas tersebut. */
  async function exportExcel() {
    setExporting(true)
    try {
      const ids = new Set(rows.map((c) => c.id))
      const acts = activities.filter((a) => ids.has(a.community_id))
      const stamp = new Date().toISOString().slice(0, 10)
      await exportToExcel('pim2-komunitas-' + stamp + '.xlsx', rows, acts, byId)
    } catch (err) {
      console.error('Gagal membuat file Excel', err)
      window.alert('Gagal membuat file Excel. Coba lagi.')
    } finally {
      setExporting(false)
    }
  }

  async function handleDelete(c: Community) {
    const ok = window.confirm('Hapus "' + c.name + '" beserta seluruh aktivitasnya?')
    if (ok) await removeCommunity(c.id)
  }

  return (
    <div className="space-y-4">
      <section className="card flex flex-wrap items-end gap-3 p-3">
        <div className="min-w-[14rem] flex-1">
          <label className="label" htmlFor="q">
            Cari
          </label>
          <input
            id="q"
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nama, alamat, PIC, produk, catatan..."
          />
        </div>

        <div>
          <label className="label" htmlFor="f-cat">
            Kategori
          </label>
          <select
            id="f-cat"
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | 'all')}
          >
            <option value="all">Semua</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="f-status">
            Status
          </label>
          <select
            id="f-status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status | 'all')}
          >
            <option value="all">Semua</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="f-band">
            Radius
          </label>
          <select
            id="f-band"
            className="input"
            value={band}
            onChange={(e) => setBand(e.target.value as RadiusBand | 'all')}
          >
            <option value="all">Semua</option>
            {RADIUS_BANDS.map((b) => (
              <option key={b} value={b}>
                {RADIUS_BAND_LABEL[b]}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="btn-ghost" onClick={() => void exportExcel()} disabled={exporting}>
            {exporting ? 'Menyiapkan...' : 'Export Excel'}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            + Tambah komunitas
          </button>
        </div>
      </section>

      <section className="card overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-navy-100 px-4 py-2.5">
          <h2 className="text-sm font-bold text-navy">
            {rows.length} komunitas
            {rows.length !== communities.length ? ' (dari ' + communities.length + ')' : ''}
          </h2>
          <p className="hidden text-[11px] text-navy-300 sm:block">
            Sel berlatar abu dapat diubah langsung - tekan Enter untuk menyimpan.
          </p>
        </header>

        {rows.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Tidak ada data yang cocok" hint="Ubah kata kunci atau filter." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px] border-collapse">
              <thead className="sticky top-0 bg-navy-700">
                <tr>
                  {COLUMNS.map((col, i) => (
                    <th
                      key={col.label + i}
                      className={'th ' + (col.align === 'right' ? 'text-right' : '')}
                    >
                      {col.key ? (
                        <button
                          type="button"
                          onClick={() => sortBy(col.key as SortKey)}
                          className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-white"
                        >
                          {col.label}
                          <span className="text-[9px]">
                            {sortKey === col.key ? (asc ? '▲' : '▼') : '⇅'}
                          </span>
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-b border-navy-50 last:border-0 hover:bg-navy-50/40">
                    <td className="td min-w-[13rem]">
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-navy">{c.name}</span>
                      </span>
                      <span className="block text-[11px] text-navy-300">
                        {c.address || 'Alamat belum diisi'}
                      </span>
                    </td>

                    <td className="td">{CATEGORY_LABEL[c.category]}</td>

                    <td className="td">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          void editCommunity(c.id, { status: e.target.value as Status })
                        }
                        aria-label={'Status ' + c.name}
                        className={
                          'chip cursor-pointer appearance-none pr-2 ' + STATUS_CHIP[c.status]
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-white text-navy-700">
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="td whitespace-nowrap text-right tabular-nums">
                      {formatDistance(c.distance_km)}
                      <span className="block text-[11px] text-navy-300">{c.radius_band}</span>
                    </td>

                    <td className="td w-24 text-right">
                      <InlineInput
                        type="number"
                        className="text-right tabular-nums"
                        value={c.estimated_members === null ? '' : String(c.estimated_members)}
                        onCommit={(v) =>
                          void editCommunity(c.id, { estimated_members: numOrNull(v) })
                        }
                      />
                    </td>

                    <td className="td min-w-[11rem]">
                      <InlineInput
                        value={c.pic_name}
                        placeholder="Nama PIC"
                        onCommit={(v) => void editCommunity(c.id, { pic_name: v })}
                      />
                      <InlineInput
                        value={c.pic_phone}
                        placeholder="Telepon"
                        className="text-[11px] text-navy-400"
                        onCommit={(v) => void editCommunity(c.id, { pic_phone: v })}
                      />
                    </td>

                    <td className="td">
                      <select
                        value={c.business_owner_potential ?? ''}
                        onChange={(e) =>
                          void editCommunity(c.id, {
                            business_owner_potential: (e.target.value || null) as Potential | null,
                          })
                        }
                        aria-label={'Potensi usaha ' + c.name}
                        className="input min-w-[7.5rem] cursor-pointer px-1.5 py-1 text-xs"
                      >
                        <option value="">Belum dinilai</option>
                        {POTENTIALS.map((p) => (
                          <option key={p} value={p}>
                            {POTENTIAL_LABEL[p]}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="td w-32 whitespace-nowrap text-right tabular-nums">
                      {formatIdrShort(c.funding_potential_idr)}
                    </td>

                    <td className="td w-[13rem] min-w-[12rem]">
                      {c.product_opportunity.length ? (
                        <span className="flex flex-wrap gap-1">
                          {c.product_opportunity.map((p) => (
                            <span key={p} className="chip bg-gold-50 text-gold-600 ring-gold-200">
                              {p}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="text-[11px] text-navy-300">Belum dipetakan</span>
                      )}
                    </td>

                    <td className="td min-w-[15rem]">
                      <InlineInput
                        value={c.next_action}
                        placeholder="Tindakan berikutnya"
                        onCommit={(v) => void editCommunity(c.id, { next_action: v })}
                      />
                      <span className="flex items-center gap-1">
                        <InlineInput
                          type="date"
                          value={c.next_action_date ?? ''}
                          className="text-[11px] text-navy-400"
                          onCommit={(v) =>
                            void editCommunity(c.id, { next_action_date: v || null })
                          }
                        />
                        {c.next_action_date ? (
                          <span className="whitespace-nowrap text-[11px] text-navy-300">
                            {relativeDay(c.next_action_date)}
                          </span>
                        ) : null}
                      </span>
                    </td>

                    <td className="td w-20 text-right">
                      <InlineInput
                        type="number"
                        className="text-right tabular-nums"
                        value={String(c.ntb_acquired)}
                        onCommit={(v) => void editCommunity(c.id, { ntb_acquired: Number(v) || 0 })}
                      />
                    </td>

                    <td className="td whitespace-nowrap text-right text-[11px] text-navy-400">
                      {formatDate(c.updated_at)}
                    </td>

                    <td className="td">
                      <span className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="btn-ghost px-2 py-1 text-xs"
                          onClick={() => {
                            setEditing(c)
                            setFormOpen(true)
                          }}
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          className="btn-danger px-2 py-1 text-xs"
                          onClick={() => void handleDelete(c)}
                        >
                          Hapus
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-[11px] text-navy-300">
        Total estimasi anggota pada hasil filter:{' '}
        <b className="text-navy-500">
          {formatNumber(rows.reduce((s, c) => s + (c.estimated_members ?? 0), 0))}
        </b>
      </p>

      <CommunityForm
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={(draft) => (editing ? editCommunity(editing.id, draft) : addCommunity(draft))}
      />
    </div>
  )
}
