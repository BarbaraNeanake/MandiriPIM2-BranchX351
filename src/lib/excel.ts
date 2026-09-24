import type { Activity, Community } from '../types'
import {
  ACTIVITY_TYPE_LABEL,
  CATEGORY_LABEL,
  POTENTIAL_LABEL,
  RADIUS_BAND_LABEL,
  STATUS_LABEL,
} from './constants'

type Cell = string | number | Date | null

interface Column<T> {
  header: string
  width: number
  value: (row: T) => Cell
  /** Format angka/tanggal Excel, mis. '#,##0' atau 'dd/mm/yyyy'. */
  numFmt?: string
}

/**
 * 'yyyy-mm-dd' -> Date pada 00:00 UTC. exceljs menulis tanggal dalam UTC, jadi
 * tanggal lokal (WIB) akan mundur satu hari di Excel bila tidak dibuat di UTC.
 */
function dateOnly(iso: string | null): Date | null {
  if (!iso) return null
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return y && m && d ? new Date(Date.UTC(y, m - 1, d)) : null
}

/** Timestamp ISO -> tanggal menurut zona waktu browser (WIB), untuk kolom tanggal Excel. */
function localDay(ts: string): Date | null {
  const t = new Date(ts)
  return Number.isNaN(t.getTime())
    ? null
    : new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()))
}

const COMMUNITY_COLUMNS: Column<Community>[] = [
  { header: 'Nama komunitas', width: 38, value: (c) => c.name },
  { header: 'Kategori', width: 12, value: (c) => CATEGORY_LABEL[c.category] },
  { header: 'Status', width: 17, value: (c) => STATUS_LABEL[c.status] },
  { header: 'Jarak (km)', width: 11, value: (c) => c.distance_km, numFmt: '0.00' },
  { header: 'Radius', width: 14, value: (c) => RADIUS_BAND_LABEL[c.radius_band] },
  { header: 'Alamat', width: 45, value: (c) => c.address },
  { header: 'Estimasi anggota', width: 12, value: (c) => c.estimated_members, numFmt: '#,##0' },
  { header: 'Nama PIC', width: 20, value: (c) => c.pic_name },
  { header: 'Telepon PIC', width: 17, value: (c) => c.pic_phone },
  { header: 'Jadwal kegiatan', width: 24, value: (c) => c.activity_schedule },
  {
    header: 'Potensi pemilik usaha',
    width: 14,
    value: (c) => (c.business_owner_potential ? POTENTIAL_LABEL[c.business_owner_potential] : 'Belum dinilai'),
  },
  { header: 'Potensi dana (Rp)', width: 18, value: (c) => c.funding_potential_idr, numFmt: '#,##0' },
  { header: 'Peluang produk', width: 26, value: (c) => c.product_opportunity.join(', ') },
  { header: 'Tindakan berikutnya', width: 32, value: (c) => c.next_action },
  { header: 'Tanggal tindakan', width: 13, value: (c) => dateOnly(c.next_action_date), numFmt: 'dd/mm/yyyy' },
  { header: 'NTB', width: 8, value: (c) => c.ntb_acquired, numFmt: '#,##0' },
  { header: 'Catatan', width: 70, value: (c) => c.notes },
  { header: 'Latitude', width: 12, value: (c) => c.lat, numFmt: '0.000000' },
  { header: 'Longitude', width: 12, value: (c) => c.lng, numFmt: '0.000000' },
  { header: 'Terakhir diperbarui', width: 13, value: (c) => localDay(c.updated_at), numFmt: 'dd/mm/yyyy' },
]

function activityColumns(byId: Map<string, Community>): Column<Activity>[] {
  return [
    { header: 'Tanggal', width: 13, value: (a) => dateOnly(a.date), numFmt: 'dd/mm/yyyy' },
    { header: 'Komunitas', width: 38, value: (a) => byId.get(a.community_id)?.name ?? '(sudah dihapus)' },
    { header: 'Jenis', width: 13, value: (a) => ACTIVITY_TYPE_LABEL[a.type] },
    { header: 'PIC internal', width: 22, value: (a) => a.pic_internal },
    { header: 'Hasil / catatan', width: 70, value: (a) => a.result },
    { header: 'NTB diperoleh', width: 13, value: (a) => a.ntb_added, numFmt: '#,##0' },
  ]
}

/**
 * Ekspor ke .xlsx: satu sheet komunitas + satu sheet aktivitas. Header navy
 * dengan filter, baris judul dibekukan, dan label berbahasa Indonesia agar
 * langsung bisa diolah di Excel tanpa perlu dirapikan.
 * exceljs diimpor dinamis supaya tidak memperberat pemuatan awal aplikasi.
 */
export async function exportToExcel(
  filename: string,
  communities: Community[],
  activities: Activity[],
  byId: Map<string, Community>,
): Promise<void> {
  const { default: ExcelJS } = await import('exceljs')
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Community Mapping KCP Pondok Indah Mall 2'
  wb.created = new Date()

  function addSheet<T>(name: string, columns: Column<T>[], rows: T[]) {
    const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] })
    ws.columns = columns.map((c) => ({ header: c.header, width: c.width }))
    for (const row of rows) ws.addRow(columns.map((c) => c.value(row) ?? null))

    columns.forEach((c, i) => {
      const col = ws.getColumn(i + 1)
      if (c.numFmt) col.numFmt = c.numFmt
      col.alignment = { vertical: 'top', wrapText: c.width >= 30 }
    })

    const header = ws.getRow(1)
    header.height = 22
    header.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF08264C' } }
      cell.alignment = { vertical: 'middle', wrapText: true }
      cell.border = { bottom: { style: 'medium', color: { argb: 'FFF5B400' } } }
    })
    if (rows.length) {
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } }
    }
  }

  addSheet('Komunitas', COMMUNITY_COLUMNS, communities)
  addSheet('Aktivitas', activityColumns(byId), activities)

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
