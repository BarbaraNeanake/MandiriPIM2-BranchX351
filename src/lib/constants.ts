import type { ActivityType, Category, Potential, Product, RadiusBand, Status } from '../types'

/** Titik acuan: Bank Mandiri KCP Pondok Indah Mall 2. */
export const BRANCH = {
  name: 'KCP Pondok Indah Mall 2',
  shortName: 'PIM 2',
  lat: -6.2656748,
  lng: 106.7829315,
} as const

export const CATEGORIES: Category[] = ['badminton', 'futsal', 'gym', 'pilates', 'lainnya']

export const CATEGORY_LABEL: Record<Category, string> = {
  badminton: 'Badminton',
  futsal: 'Futsal',
  gym: 'Gym',
  pilates: 'Pilates',
  lainnya: 'Lainnya',
}

export const STATUSES: Status[] = ['not_contacted', 'approached', 'follow_up', 'acquired', 'rejected']

/** Empat tahap funnel/kanban. Status rejected ditangani terpisah. */
export const PIPELINE_STATUSES: Status[] = ['not_contacted', 'approached', 'follow_up', 'acquired']

export const STATUS_LABEL: Record<Status, string> = {
  not_contacted: 'Belum Dihubungi',
  approached: 'Sudah Didekati',
  follow_up: 'Tindak Lanjut',
  acquired: 'Akuisisi',
  rejected: 'Ditolak',
}

/**
 * Warna marker peta dan bar funnel per status.
 * Palet ini divalidasi untuk keterbacaan penglihatan warna (CVD): pasangan yang
 * bersebelahan pada funnel punya jarak warna yang cukup, dan setiap penggunaan
 * selalu disertai label teks sehingga identitas tidak bergantung pada warna saja.
 */
export const STATUS_COLOR: Record<Status, string> = {
  not_contacted: '#5C8FD6',
  approached: '#2C5D9B',
  follow_up: '#D39B00',
  acquired: '#1E8E5A',
  rejected: '#C0392B',
}

export const STATUS_CHIP: Record<Status, string> = {
  not_contacted: 'bg-slate-100 text-slate-600 ring-slate-300',
  approached: 'bg-blue-50 text-blue-800 ring-blue-200',
  follow_up: 'bg-amber-50 text-amber-800 ring-amber-200',
  acquired: 'bg-emerald-50 text-success ring-emerald-200',
  rejected: 'bg-red-50 text-danger ring-red-200',
}

export const RADIUS_BANDS: RadiusBand[] = ['<1km', '1-3km', '3-5km', '>5km']

export const RADIUS_BAND_LABEL: Record<RadiusBand, string> = {
  '<1km': 'Di bawah 1 km',
  '1-3km': '1 - 3 km',
  '3-5km': '3 - 5 km',
  '>5km': 'Di atas 5 km',
}

/** Lingkaran radius yang digambar di peta, dalam meter. */
export const RADIUS_RINGS = [
  { radiusM: 1000, label: '1 km', color: '#1E8E5A' },
  { radiusM: 3000, label: '3 km', color: '#F5B400' },
  { radiusM: 5000, label: '5 km', color: '#C0392B' },
]

export const POTENTIALS: Potential[] = ['low', 'medium', 'high']

export const POTENTIAL_LABEL: Record<Potential, string> = {
  low: 'Rendah',
  medium: 'Menengah',
  high: 'Tinggi',
}

export const PRODUCTS: Product[] = [
  'Livin',
  'Tabungan Bisnis',
  'Giro',
  'Livin Merchant',
  'EDC',
  'Payroll',
  'KSM',
  'CC',
  'RTW',
]

export const ACTIVITY_TYPES: ActivityType[] = ['visit', 'call', 'event', 'onboarding']

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  visit: 'Kunjungan',
  call: 'Telepon',
  event: 'Event',
  onboarding: 'Onboarding',
}

export const ACTIVITY_TYPE_COLOR: Record<ActivityType, string> = {
  visit: '#0A2E5C',
  call: '#3F6BA6',
  event: '#F5B400',
  onboarding: '#1E8E5A',
}

/** Ambang butuh tindak lanjut: tidak ada pembaruan selama N hari. */
export const STALE_DAYS = 30
