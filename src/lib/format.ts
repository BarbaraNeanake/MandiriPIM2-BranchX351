/** Helper format untuk antarmuka berbahasa Indonesia. */

export function formatIdr(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '-'
  return 'Rp ' + Math.round(value).toLocaleString('id-ID')
}

/** Rp 1,2 M / Rp 850 jt / Rp 12 rb - ringkas untuk kartu KPI. */
export function formatIdrShort(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '-'
  const abs = Math.abs(value)
  const fmt = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 })
  if (abs >= 1_000_000_000_000) return 'Rp ' + fmt(value / 1_000_000_000_000) + ' T'
  if (abs >= 1_000_000_000) return 'Rp ' + fmt(value / 1_000_000_000) + ' M'
  if (abs >= 1_000_000) return 'Rp ' + fmt(value / 1_000_000) + ' jt'
  if (abs >= 1_000) return 'Rp ' + fmt(value / 1_000) + ' rb'
  return 'Rp ' + fmt(value)
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '-'
  return value.toLocaleString('id-ID')
}

/** yyyy-mm-dd -> 24 Sep 2026 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-'
  const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const MS_PER_DAY = 86_400_000

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Tanggal ISO (yyyy-mm-dd) n hari yang lalu. Nilai negatif untuk masa depan. */
export function daysAgoIso(n: number): string {
  return new Date(Date.now() - n * MS_PER_DAY).toISOString().slice(0, 10)
}

/** Selisih hari dari hari ini; positif berarti sudah lewat. */
export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null
  const d = new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso)
  if (Number.isNaN(d.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  return Math.round((today.getTime() - target.getTime()) / MS_PER_DAY)
}

/** "3 hari lalu", "hari ini", "dalam 5 hari" */
export function relativeDay(iso: string | null | undefined): string {
  const diff = daysSince(iso)
  if (diff === null) return '-'
  if (diff === 0) return 'hari ini'
  if (diff === 1) return 'kemarin'
  if (diff > 0) return diff + ' hari lalu'
  if (diff === -1) return 'besok'
  return 'dalam ' + Math.abs(diff) + ' hari'
}
