import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CATEGORIES,
  CATEGORY_LABEL,
  PIPELINE_STATUSES,
  RADIUS_BANDS,
  RADIUS_BAND_LABEL,
  STALE_DAYS,
  STATUS_COLOR,
  STATUS_LABEL,
} from '../lib/constants'
import { formatDate, formatIdrShort, formatNumber, daysSince, relativeDay } from '../lib/format'
import { formatDistance } from '../lib/geo'
import { useData } from '../state/DataContext'
import { BarList, KpiPanel, type BarDatum } from '../components/charts'
import { EmptyState, SectionCard, StatusChip } from '../components/ui'
import UsageGuide from '../components/UsageGuide'
import type { Community } from '../types'

interface Attention {
  community: Community
  reason: string
  urgency: number
}

/** Komunitas butuh tindak lanjut bila jadwal tindakannya lewat atau lama tak diperbarui. */
function attentionOf(c: Community): Attention | null {
  if (c.status === 'rejected') return null
  const overdue = c.next_action_date ? (daysSince(c.next_action_date) ?? -1) : -1
  if (overdue >= 0) {
    const reason =
      overdue === 0 ? 'Jadwal tindakan jatuh hari ini' : 'Jadwal tindakan lewat ' + overdue + ' hari'
    return { community: c, reason, urgency: 1000 + overdue }
  }
  const idle = daysSince(c.updated_at) ?? 0
  if (idle > STALE_DAYS) {
    return { community: c, reason: 'Tidak ada pembaruan ' + idle + ' hari', urgency: idle }
  }
  return null
}

export default function Dashboard() {
  const { communities, activities } = useData()

  const stats = useMemo(() => {
    const total = communities.length
    const members = communities.reduce((s, c) => s + (c.estimated_members ?? 0), 0)
    const engaged = communities.filter((c) => c.status !== 'not_contacted').length
    const ntb = communities.reduce((s, c) => s + (c.ntb_acquired ?? 0), 0)
    const funding = communities.reduce((s, c) => s + (c.funding_potential_idr ?? 0), 0)
    const withinThree = communities.filter(
      (c) => c.radius_band === '<1km' || c.radius_band === '1-3km',
    ).length
    return { total, members, engaged, ntb, funding, withinThree }
  }, [communities])

  const funnel: BarDatum[] = useMemo(() => {
    const total = Math.max(1, communities.length)
    return PIPELINE_STATUSES.map((s) => {
      const value = communities.filter((c) => c.status === s).length
      return {
        key: s,
        label: STATUS_LABEL[s],
        value,
        color: STATUS_COLOR[s],
        note: Math.round((value / total) * 100) + '%',
      }
    })
  }, [communities])

  const byCategory: BarDatum[] = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        key: cat,
        label: CATEGORY_LABEL[cat],
        value: communities.filter((c) => c.category === cat).length,
        color: '#2C5D9B',
      })).filter((d) => d.value > 0),
    [communities],
  )

  const byRadius: BarDatum[] = useMemo(
    () =>
      RADIUS_BANDS.map((band) => ({
        key: band,
        label: RADIUS_BAND_LABEL[band],
        value: communities.filter((c) => c.radius_band === band).length,
        color: '#0A2E5C',
      })).filter((d) => d.value > 0),
    [communities],
  )

  const attention = useMemo(
    () =>
      communities
        .map(attentionOf)
        .filter((x): x is Attention => x !== null)
        .sort((a, b) => b.urgency - a.urgency),
    [communities],
  )

  const rejected = communities.filter((c) => c.status === 'rejected').length

  return (
    <div className="space-y-5">
      <KpiPanel
        title="Ringkasan ekosistem"
        items={[
          {
            label: 'Total komunitas',
            value: formatNumber(stats.total),
            sub: stats.withinThree + ' dalam radius 3 km dari cabang',
          },
          {
            label: 'Estimasi member',
            value: formatNumber(stats.members),
            sub: 'Akumulasi hasil survei',
          },
          {
            label: 'Sudah di-approach',
            value: formatNumber(stats.engaged),
            sub: stats.total
              ? Math.round((stats.engaged / stats.total) * 100) + '% dari seluruh komunitas'
              : 'Belum ada komunitas',
          },
          {
            label: 'NTB terkumpul',
            value: formatNumber(stats.ntb),
            sub: 'Potensi dana ' + formatIdrShort(stats.funding),
            highlight: true,
          },
        ]}
      />

      <UsageGuide />

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <SectionCard
          title="Funnel akuisisi"
          action={
            <Link to="/pipeline" className="text-xs font-semibold text-navy-400 hover:text-navy">
              Buka pipeline
            </Link>
          }
        >
          <BarList data={funnel} max={communities.length} valueSuffix="komunitas" />
          <p className="mt-3 border-t border-navy-50 pt-2 text-[11px] leading-snug text-navy-300">
            Persentase terhadap {formatNumber(stats.total)} komunitas terpetakan.
            {rejected > 0
              ? ' ' + rejected + ' berstatus Ditolak, di luar funnel.'
              : ''}
          </p>
        </SectionCard>

        <SectionCard title="Sebaran per kategori">
          <BarList data={byCategory} valueSuffix="komunitas" />
          <p className="mt-3 border-t border-navy-50 pt-2 text-[11px] leading-snug text-navy-300">
            Kategori tanpa komunitas tidak ditampilkan.
          </p>
        </SectionCard>

        <SectionCard title="Sebaran per pita radius">
          <BarList data={byRadius} valueSuffix="komunitas" />
          <p className="mt-3 border-t border-navy-50 pt-2 text-[11px] leading-snug text-navy-300">
            Jarak garis lurus dari titik cabang.
          </p>
        </SectionCard>
      </div>

      <SectionCard
        title={'Butuh tindak lanjut (' + attention.length + ')'}
        action={
          <Link to="/database" className="text-xs font-semibold text-navy-400 hover:text-navy">
            Buka database
          </Link>
        }
      >
        {attention.length === 0 ? (
          <EmptyState
            title="Tidak ada yang tertunda"
            hint={'Semua komunitas punya pembaruan dalam ' + STALE_DAYS + ' hari terakhir.'}
          />
        ) : (
          <div className="-mx-5 -mb-5 overflow-x-auto border-t border-line">
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="bg-navy-700">
                <tr>
                  <th className="th">Komunitas</th>
                  <th className="th">Status</th>
                  <th className="th">Jarak</th>
                  <th className="th">Alasan</th>
                  <th className="th">Tindakan berikutnya</th>
                </tr>
              </thead>
              <tbody>
                {attention.map(({ community: c, reason, urgency }) => (
                  <tr
                    key={c.id}
                    className="border-b border-navy-50 last:border-0 hover:bg-navy-50/50"
                  >
                    <td className="td">
                      <span className="font-semibold text-navy">{c.name}</span>
                    </td>
                    <td className="td">
                      <StatusChip status={c.status} />
                    </td>
                    <td className="td whitespace-nowrap tabular-nums">
                      {formatDistance(c.distance_km)}
                    </td>
                    <td className="td">
                      <span
                        className={
                          'text-xs font-medium ' +
                          (urgency >= 1000 ? 'text-danger' : 'text-navy-400')
                        }
                      >
                        {reason}
                      </span>
                    </td>
                    <td className="td">
                      {c.next_action ? (
                        <span>
                          {c.next_action}
                          {c.next_action_date ? (
                            <span className="ml-1 text-[11px] text-navy-300">
                              ({formatDate(c.next_action_date)}, {relativeDay(c.next_action_date)})
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <span className="text-xs text-navy-300">Belum ditentukan</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <p className="text-[11px] leading-relaxed text-navy-300">
        {formatNumber(activities.length)} aktivitas tercatat. Seluruh data komunitas bersifat
        publik - tidak ada data nasabah pada aplikasi ini.
      </p>
    </div>
  )
}
