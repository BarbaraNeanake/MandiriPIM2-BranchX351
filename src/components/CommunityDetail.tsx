import type { Community, Status } from '../types'
import {
  ACTIVITY_TYPE_LABEL,
  RADIUS_BAND_LABEL,
  STATUSES,
  STATUS_LABEL,
} from '../lib/constants'
import { formatDistance } from '../lib/geo'
import { formatDate, formatIdr, formatNumber, relativeDay } from '../lib/format'
import { useData } from '../state/DataContext'
import { CategoryChip, PotentialChip, StatusChip } from './ui'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-navy-50 py-1.5 last:border-0">
      <dt className="w-32 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-navy-400">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-sm text-navy-700">{value || '-'}</dd>
    </div>
  )
}

export default function CommunityDetail({
  community,
  onEdit,
  onClose,
}: {
  community: Community
  onEdit?: (c: Community) => void
  onClose?: () => void
}) {
  const { activities, editCommunity } = useData()
  const own = activities
    .filter((a) => a.community_id === community.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start gap-2 border-b border-navy-100 px-4 py-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-navy">{community.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <CategoryChip category={community.category} />
            <StatusChip status={community.status} />
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-navy-300 hover:bg-navy-50 hover:text-navy"
            aria-label="Tutup panel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <dl>
          <Row
            label="Jarak"
            value={
              <span>
                {formatDistance(community.distance_km)}{' '}
                <span className="text-navy-300">
                  ({RADIUS_BAND_LABEL[community.radius_band]})
                </span>
              </span>
            }
          />
          <Row label="Alamat" value={community.address} />
          <Row label="Koordinat" value={community.lat.toFixed(6) + ', ' + community.lng.toFixed(6)} />
          <Row label="Jadwal" value={community.activity_schedule} />
          <Row label="Estimasi anggota" value={formatNumber(community.estimated_members)} />
          <Row label="PIC" value={[community.pic_name, community.pic_phone].filter(Boolean).join(' - ')} />
          <Row
            label="Potensi usaha"
            value={<PotentialChip potential={community.business_owner_potential} />}
          />
          <Row label="Potensi dana" value={formatIdr(community.funding_potential_idr)} />
          <Row
            label="Peluang produk"
            value={
              community.product_opportunity.length ? (
                <span className="flex flex-wrap gap-1">
                  {community.product_opportunity.map((p) => (
                    <span key={p} className="chip bg-gold-50 text-gold-600 ring-gold-200">
                      {p}
                    </span>
                  ))}
                </span>
              ) : null
            }
          />
          <Row label="NTB terkumpul" value={formatNumber(community.ntb_acquired)} />
          <Row
            label="Tindakan"
            value={
              community.next_action ? (
                <span>
                  {community.next_action}
                  {community.next_action_date && (
                    <span className="ml-1 text-navy-300">
                      ({formatDate(community.next_action_date)} -{' '}
                      {relativeDay(community.next_action_date)})
                    </span>
                  )}
                </span>
              ) : null
            }
          />
          <Row label="Catatan" value={community.notes} />
        </dl>

        <h4 className="mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-wide text-navy-400">
          Aktivitas terakhir
        </h4>
        {own.length === 0 ? (
          <p className="text-xs text-navy-300">Belum ada aktivitas tercatat.</p>
        ) : (
          <ul className="space-y-1.5">
            {own.slice(0, 5).map((a) => (
              <li key={a.id} className="rounded-md bg-navy-50/70 px-2.5 py-2 text-xs text-navy-600">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-navy">{ACTIVITY_TYPE_LABEL[a.type]}</span>
                  <span className="text-navy-300">{formatDate(a.date)}</span>
                </div>
                <p className="mt-0.5 leading-snug">{a.result}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="flex items-center gap-2 border-t border-navy-100 px-4 py-3">
        <select
          className="input flex-1"
          value={community.status}
          onChange={(e) => void editCommunity(community.id, { status: e.target.value as Status })}
          aria-label="Ubah status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        {onEdit && (
          <button type="button" className="btn-primary" onClick={() => onEdit(community)}>
            Ubah detail
          </button>
        )}
      </footer>
    </div>
  )
}
