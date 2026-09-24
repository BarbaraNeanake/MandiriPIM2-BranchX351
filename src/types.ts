/** Model data inti PIM 2 Community Ecosystem Mapping. */

export type Category = 'badminton' | 'futsal' | 'gym' | 'pilates' | 'lainnya'

/**
 * Pita radius dari cabang. Spesifikasi awal hanya menyebut tiga pita; pita ke-4
 * menampung komunitas tambahan di luar 5 km agar data tidak dipaksakan.
 */
export type RadiusBand = '<1km' | '1-3km' | '3-5km' | '>5km'

export type Potential = 'low' | 'medium' | 'high'

export type Product =
  | 'Livin'
  | 'Tabungan Bisnis'
  | 'Giro'
  | 'Livin Merchant'
  | 'EDC'
  | 'Payroll'
  | 'KSM'
  | 'CC'
  | 'RTW'

export type Status = 'not_contacted' | 'approached' | 'follow_up' | 'acquired' | 'rejected'

export type ActivityType = 'visit' | 'call' | 'event' | 'onboarding'

export interface Community {
  id: string
  name: string
  category: Category
  address: string
  lat: number
  lng: number
  /** Diturunkan: jarak haversine dari titik cabang, dalam kilometer. */
  distance_km: number
  /** Diturunkan dari distance_km. */
  radius_band: RadiusBand
  estimated_members: number | null
  pic_name: string
  pic_phone: string
  activity_schedule: string
  /** null = belum dinilai tim. */
  business_owner_potential: Potential | null
  funding_potential_idr: number | null
  product_opportunity: Product[]
  status: Status
  next_action: string
  /** Tanggal ISO (yyyy-mm-dd) atau null. */
  next_action_date: string | null
  notes: string
  ntb_acquired: number
  /** Timestamp ISO. */
  updated_at: string
}

export interface Activity {
  id: string
  community_id: string
  /** Tanggal ISO (yyyy-mm-dd). */
  date: string
  type: ActivityType
  pic_internal: string
  result: string
  ntb_added: number
  created_at: string
}

/** Field yang boleh ditulis pengguna; sisanya diturunkan oleh repo. */
export type CommunityDraft = Omit<
  Community,
  'id' | 'distance_km' | 'radius_band' | 'updated_at'
>

export type ActivityDraft = Omit<Activity, 'id' | 'created_at'>
