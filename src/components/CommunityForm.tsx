import { useMemo, useState, type FormEvent } from 'react'
import type { Category, Community, CommunityDraft, Potential, Product, Status } from '../types'
import {
  CATEGORIES,
  CATEGORY_LABEL,
  POTENTIALS,
  POTENTIAL_LABEL,
  PRODUCTS,
  RADIUS_BAND_LABEL,
  STATUSES,
  STATUS_LABEL,
} from '../lib/constants'
import { distanceFromBranchKm, formatDistance, radiusBandOf } from '../lib/geo'
import { Field, Modal } from './ui'
import { toDraft } from '../lib/repo'

export const EMPTY_DRAFT: CommunityDraft = {
  name: '',
  category: 'badminton',
  address: '',
  lat: -6.2656748,
  lng: 106.7829315,
  estimated_members: null,
  pic_name: '',
  pic_phone: '',
  activity_schedule: '',
  business_owner_potential: null,
  funding_potential_idr: null,
  product_opportunity: [],
  status: 'not_contacted',
  next_action: '',
  next_action_date: null,
  notes: '',
  ntb_acquired: 0,
}

function numOrNull(v: string): number | null {
  const n = Number(v)
  return v.trim() === '' || Number.isNaN(n) ? null : n
}

interface Props {
  open: boolean
  initial: Community | null
  onClose: () => void
  onSubmit: (draft: CommunityDraft) => Promise<unknown>
}

export default function CommunityForm({ open, initial, onClose, onSubmit }: Props) {
  const [draft, setDraft] = useState<CommunityDraft>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)
  const [formKey, setFormKey] = useState<string>('')

  // Sinkronkan state form ketika komunitas yang diedit berganti.
  const wantedKey = (initial?.id ?? 'new') + String(open)
  if (open && formKey !== wantedKey) {
    setFormKey(wantedKey)
    setDraft(initial ? toDraft(initial) : EMPTY_DRAFT)
  }

  const preview = useMemo(() => {
    const km = distanceFromBranchKm({ lat: draft.lat, lng: draft.lng })
    return { km, band: radiusBandOf(km) }
  }, [draft])

  const set = <K extends keyof CommunityDraft>(key: K, value: CommunityDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const toggleProduct = (p: Product) =>
    setDraft((d) => ({
      ...d,
      product_opportunity: d.product_opportunity.includes(p)
        ? d.product_opportunity.filter((x) => x !== p)
        : [...d.product_opportunity, p],
    }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft.name.trim()) return
    setSaving(true)
    try {
      await onSubmit({ ...draft, name: draft.name.trim() })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      wide
      title={initial ? 'Ubah komunitas: ' + initial.name : 'Tambah komunitas baru'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nama komunitas / venue" className="sm:col-span-2">
            <input
              className="input"
              required
              value={draft.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="mis. PB NOLSATU"
            />
          </Field>

          <Field label="Kategori">
            <select
              className="input"
              value={draft.category}
              onChange={(e) => set('category', e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              className="input"
              value={draft.status}
              onChange={(e) => set('status', e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Alamat" className="sm:col-span-2">
            <input
              className="input"
              value={draft.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Diisi saat survei lapangan"
            />
          </Field>

          <Field label="Latitude">
            <input
              className="input"
              type="number"
              step="any"
              required
              value={draft.lat}
              onChange={(e) => set('lat', Number(e.target.value))}
            />
          </Field>

          <Field label="Longitude">
            <input
              className="input"
              type="number"
              step="any"
              required
              value={draft.lng}
              onChange={(e) => set('lng', Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-md bg-navy-50 px-3 py-2 text-xs text-navy-500">
          <span>
            Jarak dari PIM 2: <b className="text-navy">{formatDistance(preview.km)}</b>
          </span>
          <span>
            Pita radius: <b className="text-navy">{RADIUS_BAND_LABEL[preview.band]}</b>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Estimasi anggota" hint="Kosongkan bila belum disurvei">
            <input
              className="input"
              type="number"
              min={0}
              value={draft.estimated_members ?? ''}
              onChange={(e) => set('estimated_members', numOrNull(e.target.value))}
            />
          </Field>

          <Field label="Potensi pemilik usaha">
            <select
              className="input"
              value={draft.business_owner_potential ?? ''}
              onChange={(e) =>
                set('business_owner_potential', (e.target.value || null) as Potential | null)
              }
            >
              <option value="">Belum dinilai</option>
              {POTENTIALS.map((p) => (
                <option key={p} value={p}>
                  {POTENTIAL_LABEL[p]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Nama PIC komunitas">
            <input
              className="input"
              value={draft.pic_name}
              onChange={(e) => set('pic_name', e.target.value)}
              placeholder="Diisi saat survei"
            />
          </Field>

          <Field label="Telepon PIC">
            <input
              className="input"
              value={draft.pic_phone}
              onChange={(e) => set('pic_phone', e.target.value)}
              placeholder="Diisi saat survei"
            />
          </Field>

          <Field label="Jadwal aktivitas" className="sm:col-span-2">
            <input
              className="input"
              value={draft.activity_schedule}
              onChange={(e) => set('activity_schedule', e.target.value)}
              placeholder="mis. Selasa & Kamis 19.00 - 22.00"
            />
          </Field>

          <Field label="Potensi dana (Rp)">
            <input
              className="input"
              type="number"
              min={0}
              step={1000000}
              value={draft.funding_potential_idr ?? ''}
              onChange={(e) => set('funding_potential_idr', numOrNull(e.target.value))}
            />
          </Field>

          <Field label="NTB terkumpul">
            <input
              className="input"
              type="number"
              min={0}
              value={draft.ntb_acquired}
              onChange={(e) => set('ntb_acquired', Number(e.target.value) || 0)}
            />
          </Field>
        </div>

        <Field label="Peluang produk">
          <div className="flex flex-wrap gap-1.5">
            {PRODUCTS.map((p) => {
              const on = draft.product_opportunity.includes(p)
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProduct(p)}
                  className={
                    'rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition ' +
                    (on
                      ? 'bg-navy text-white ring-navy'
                      : 'bg-white text-navy-500 ring-navy-200 hover:bg-navy-50')
                  }
                >
                  {p}
                </button>
              )
            })}
          </div>
        </Field>

        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Tindakan berikutnya" className="sm:col-span-2">
            <input
              className="input"
              value={draft.next_action}
              onChange={(e) => set('next_action', e.target.value)}
              placeholder="mis. Presentasi Livin saat latihan rutin"
            />
          </Field>

          <Field label="Tanggal tindakan">
            <input
              className="input"
              type="date"
              value={draft.next_action_date ?? ''}
              onChange={(e) => set('next_action_date', e.target.value || null)}
            />
          </Field>
        </div>

        <Field label="Catatan">
          <textarea
            className="input min-h-[72px] resize-y"
            value={draft.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </Field>

        <footer className="flex justify-end gap-2 border-t border-navy-100 pt-3">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : initial ? 'Simpan perubahan' : 'Tambah komunitas'}
          </button>
        </footer>
      </form>
    </Modal>
  )
}
