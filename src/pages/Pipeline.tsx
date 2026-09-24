import { useMemo, useState, type DragEvent } from 'react'
import CommunityDetail from '../components/CommunityDetail'
import { Modal } from '../components/ui'
import {
  CATEGORY_LABEL,
  PIPELINE_STATUSES,
  STATUS_COLOR,
  STATUS_LABEL,
} from '../lib/constants'
import { formatDistance } from '../lib/geo'
import { formatDate, formatNumber, relativeDay } from '../lib/format'
import { useData } from '../state/DataContext'
import type { Community, Status } from '../types'

function Card({
  community,
  onOpen,
  onDragStart,
  dragging,
}: {
  community: Community
  onOpen: () => void
  onDragStart: (e: DragEvent<HTMLElement>) => void
  dragging: boolean
}) {
  const overdue =
    community.next_action_date !== null && new Date(community.next_action_date) <= new Date()

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className={
        'cursor-grab rounded-md border border-navy-100 bg-white p-2.5 shadow-sm transition ' +
        'hover:border-navy-300 hover:shadow-card active:cursor-grabbing ' +
        (dragging ? 'opacity-40' : '')
      }
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-navy">
          {community.name}
        </h3>
      </div>

      <p className="mt-1 text-[11px] text-navy-400">
        {CATEGORY_LABEL[community.category]} - {formatDistance(community.distance_km)}
        {community.estimated_members
          ? ' - ' + formatNumber(community.estimated_members) + ' anggota'
          : ''}
      </p>

      {community.next_action ? (
        <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-navy-600">
          {community.next_action}
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {community.ntb_acquired > 0 ? (
          <span className="chip bg-emerald-50 text-success ring-emerald-200">
            {community.ntb_acquired} NTB
          </span>
        ) : null}
        {community.next_action_date ? (
          <span
            className={
              'chip ' +
              (overdue
                ? 'bg-red-50 text-danger ring-red-200'
                : 'bg-navy-50 text-navy-400 ring-navy-200')
            }
            title={formatDate(community.next_action_date)}
          >
            {relativeDay(community.next_action_date)}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export default function Pipeline() {
  const { communities, editCommunity } = useData()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStatus, setOverStatus] = useState<Status | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<Status, Community[]>()
    for (const s of [...PIPELINE_STATUSES, 'rejected' as Status]) map.set(s, [])
    for (const c of communities) map.get(c.status)?.push(c)
    return map
  }, [communities])

  function onDrop(status: Status) {
    return (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      const id = e.dataTransfer.getData('text/plain') || draggingId
      setOverStatus(null)
      setDraggingId(null)
      if (!id) return
      const current = communities.find((c) => c.id === id)
      if (current && current.status !== status) void editCommunity(id, { status })
    }
  }

  function allowDrop(status: Status) {
    return (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (overStatus !== status) setOverStatus(status)
    }
  }

  const opened = communities.find((c) => c.id === openId) ?? null
  const rejected = grouped.get('rejected') ?? []

  return (
    <div className="space-y-4">
      <p className="text-xs text-navy-400">
        Seret kartu antar kolom untuk memindahkan tahap. Perubahan langsung tersimpan dan
        memperbarui funnel di Dashboard.
      </p>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {PIPELINE_STATUSES.map((status) => {
          const items = grouped.get(status) ?? []
          const ntb = items.reduce((s, c) => s + c.ntb_acquired, 0)
          return (
            <section
              key={status}
              onDragOver={allowDrop(status)}
              onDragLeave={() => setOverStatus((s) => (s === status ? null : s))}
              onDrop={onDrop(status)}
              className={
                'flex min-h-[18rem] flex-col rounded-lg border bg-navy-50/40 transition ' +
                (overStatus === status
                  ? 'border-navy-400 bg-navy-50 ring-2 ring-navy-100'
                  : 'border-navy-100')
              }
            >
              <header
                className="rounded-t-lg border-b border-navy-100 bg-white px-3 py-2"
                style={{ borderTop: '3px solid ' + STATUS_COLOR[status] }}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-navy">
                    {STATUS_LABEL[status]}
                  </h2>
                  <span className="chip bg-navy-50 text-navy-500 ring-navy-200 tabular-nums">
                    {items.length}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-navy-300">
                  {formatNumber(items.reduce((s, c) => s + (c.estimated_members ?? 0), 0))} estimasi
                  anggota{ntb > 0 ? ' - ' + ntb + ' NTB' : ''}
                </p>
              </header>

              <div className="flex-1 space-y-2 overflow-y-auto p-2">
                {items.length === 0 ? (
                  <p className="rounded-md border border-dashed border-navy-200 px-3 py-6 text-center text-[11px] text-navy-300">
                    Lepas kartu di sini
                  </p>
                ) : (
                  items.map((c) => (
                    <Card
                      key={c.id}
                      community={c}
                      dragging={draggingId === c.id}
                      onOpen={() => setOpenId(c.id)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', c.id)
                        e.dataTransfer.effectAllowed = 'move'
                        setDraggingId(c.id)
                      }}
                    />
                  ))
                )}
              </div>
            </section>
          )
        })}
      </div>

      <section
        onDragOver={allowDrop('rejected')}
        onDragLeave={() => setOverStatus((s) => (s === 'rejected' ? null : s))}
        onDrop={onDrop('rejected')}
        className={
          'rounded-lg border border-dashed p-3 transition ' +
          (overStatus === 'rejected' ? 'border-danger bg-red-50' : 'border-navy-200 bg-white')
        }
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-navy">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: STATUS_COLOR.rejected }}
              aria-hidden
            />
            {STATUS_LABEL.rejected}
          </h2>
          <span className="chip bg-red-50 text-danger ring-red-200 tabular-nums">
            {rejected.length}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-navy-300">
          Di luar funnel utama. Seret kartu ke sini bila komunitas menolak, atau tarik kembali ke
          kolom mana pun untuk mengaktifkan lagi.
        </p>
        {rejected.length > 0 ? (
          <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {rejected.map((c) => (
              <Card
                key={c.id}
                community={c}
                dragging={draggingId === c.id}
                onOpen={() => setOpenId(c.id)}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', c.id)
                  e.dataTransfer.effectAllowed = 'move'
                  setDraggingId(c.id)
                }}
              />
            ))}
          </div>
        ) : null}
      </section>

      <Modal
        open={opened !== null}
        title="Detail komunitas"
        onClose={() => setOpenId(null)}
        wide
      >
        {opened ? (
          <div className="-mx-5 -my-4 max-h-[75vh]">
            <CommunityDetail community={opened} onClose={() => setOpenId(null)} />
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
