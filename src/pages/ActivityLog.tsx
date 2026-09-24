import { useMemo, useState, type FormEvent } from 'react'
import { EmptyState, Field, SectionCard, StatusChip } from '../components/ui'
import { KpiPanel } from '../components/charts'
import {
  ACTIVITY_TYPES,
  ACTIVITY_TYPE_COLOR,
  ACTIVITY_TYPE_LABEL,
} from '../lib/constants'
import { formatDate, formatNumber, relativeDay, todayIso } from '../lib/format'
import { useData } from '../state/DataContext'
import type { ActivityType } from '../types'

const EMPTY_FORM = {
  community_id: '',
  date: todayIso(),
  type: 'visit' as ActivityType,
  pic_internal: '',
  result: '',
  ntb_added: 0,
}

export default function ActivityLog() {
  const { communities, activities, addActivity, removeActivity } = useData()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [filterCommunity, setFilterCommunity] = useState<string>('all')
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all')

  const byId = useMemo(() => new Map(communities.map((c) => [c.id, c])), [communities])

  const visible = useMemo(
    () =>
      activities
        .filter((a) => filterCommunity === 'all' || a.community_id === filterCommunity)
        .filter((a) => filterType === 'all' || a.type === filterType)
        .sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at)),
    [activities, filterCommunity, filterType],
  )

  const stats = useMemo(() => {
    const ntb = activities.reduce((s, a) => s + a.ntb_added, 0)
    const cutoff = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
    const recent = activities.filter((a) => a.date >= cutoff).length
    const touched = new Set(activities.map((a) => a.community_id)).size
    return { ntb, recent, touched }
  }, [activities])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.community_id || !form.result.trim()) return
    setSaving(true)
    try {
      await addActivity({ ...form, result: form.result.trim() })
      setForm({ ...EMPTY_FORM, community_id: form.community_id, date: form.date })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <KpiPanel
        title="Ringkasan aktivitas"
        items={[
          {
            label: 'Total aktivitas',
            value: formatNumber(activities.length),
            sub: stats.touched + ' komunitas pernah disentuh',
          },
          {
            label: 'Aktivitas 30 hari terakhir',
            value: formatNumber(stats.recent),
            sub: 'Kunjungan, telepon, event, onboarding',
          },
          {
            label: 'NTB dari aktivitas',
            value: formatNumber(stats.ntb),
            sub: 'Terakumulasi otomatis ke kartu komunitas',
            highlight: true,
          },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <SectionCard title="Catat aktivitas baru" className="h-fit">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Komunitas">
              <select
                className="input"
                required
                value={form.community_id}
                onChange={(e) => setForm((f) => ({ ...f, community_id: e.target.value }))}
              >
                <option value="">Pilih komunitas...</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal">
                <input
                  className="input"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </Field>
              <Field label="Jenis">
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value as ActivityType }))
                  }
                >
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {ACTIVITY_TYPE_LABEL[t]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="PIC internal" hint="Nama atau unit petugas out-branch">
              <input
                className="input"
                value={form.pic_internal}
                onChange={(e) => setForm((f) => ({ ...f, pic_internal: e.target.value }))}
                placeholder="mis. Tim Out-Branch PIM 2"
              />
            </Field>

            <Field label="Hasil / catatan">
              <textarea
                className="input min-h-[80px] resize-y"
                required
                value={form.result}
                onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))}
                placeholder="Apa yang terjadi dan apa tindak lanjutnya?"
              />
            </Field>

            <Field label="NTB diperoleh" hint="Menambah total NTB komunitas terkait">
              <input
                className="input"
                type="number"
                min={0}
                value={form.ntb_added}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ntb_added: Number(e.target.value) || 0 }))
                }
              />
            </Field>

            <button type="submit" className="btn-primary w-full" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan aktivitas'}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title={'Timeline (' + visible.length + ')'}
          action={
            <div className="flex gap-2">
              <select
                className="input py-1 text-xs"
                value={filterCommunity}
                onChange={(e) => setFilterCommunity(e.target.value)}
                aria-label="Filter komunitas"
              >
                <option value="all">Semua komunitas</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                className="input py-1 text-xs"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as ActivityType | 'all')}
                aria-label="Filter jenis aktivitas"
              >
                <option value="all">Semua jenis</option>
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ACTIVITY_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          {visible.length === 0 ? (
            <EmptyState
              title="Belum ada aktivitas"
              hint="Catat kunjungan atau kontak pertama lewat formulir di samping."
            />
          ) : (
            <ol className="relative space-y-4 border-l border-navy-100 pl-5">
              {visible.map((a) => {
                const community = byId.get(a.community_id)
                return (
                  <li key={a.id} className="relative">
                    <span
                      className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full ring-2 ring-white"
                      style={{ background: ACTIVITY_TYPE_COLOR[a.type] }}
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-navy">
                        {community?.name ?? 'Komunitas terhapus'}
                      </span>
                      <span
                        className="chip ring-transparent"
                        style={{
                          background: ACTIVITY_TYPE_COLOR[a.type] + '18',
                          color: ACTIVITY_TYPE_COLOR[a.type],
                        }}
                      >
                        {ACTIVITY_TYPE_LABEL[a.type]}
                      </span>
                      {community ? <StatusChip status={community.status} /> : null}
                      {a.ntb_added > 0 ? (
                        <span className="chip bg-emerald-50 text-success ring-emerald-200">
                          +{a.ntb_added} NTB
                        </span>
                      ) : null}
                      <span className="ml-auto whitespace-nowrap text-[11px] text-navy-300">
                        {formatDate(a.date)} - {relativeDay(a.date)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-snug text-navy-700">{a.result}</p>

                    <div className="mt-1 flex items-center gap-3">
                      {a.pic_internal ? (
                        <span className="text-[11px] text-navy-400">PIC: {a.pic_internal}</span>
                      ) : null}
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-navy-300 transition hover:text-danger"
                        onClick={() => {
                          if (window.confirm('Hapus catatan aktivitas ini?')) {
                            void removeActivity(a.id)
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
          <p className="mt-4 border-t border-navy-50 pt-2 text-[11px] text-navy-300">
            Menghapus aktivitas tidak mengurangi total NTB komunitas - sesuaikan manual lewat
            halaman Database bila perlu.
          </p>
        </SectionCard>
      </div>
    </div>
  )
}
