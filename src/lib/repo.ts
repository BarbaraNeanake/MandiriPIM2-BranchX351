import type { Activity, ActivityDraft, Community, CommunityDraft } from '../types'
import { distanceFromBranchKm, radiusBandOf } from './geo'
import { HAS_SUPABASE } from './env'
import { getSupabase } from './supabase'
import { SEED_ACTIVITIES, seedCommunities } from './seed'

/* -------------------------------------------------------------------------- */
/* Kontrak repository                                                          */
/* -------------------------------------------------------------------------- */

export interface Repo {
  readonly kind: 'localStorage' | 'supabase'
  /** Memuat data awal; mengisi seed bila penyimpanan masih kosong. */
  init(): Promise<void>
  listCommunities(): Promise<Community[]>
  createCommunity(draft: CommunityDraft): Promise<Community>
  updateCommunity(id: string, patch: Partial<CommunityDraft>): Promise<Community>
  deleteCommunity(id: string): Promise<void>
  listActivities(): Promise<Activity[]>
  createActivity(draft: ActivityDraft): Promise<Activity>
  deleteActivity(id: string): Promise<void>
  /** Kembalikan ke data seed. */
  resetToSeed(): Promise<void>
}

export function newId(): string {
  const c = globalThis.crypto
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  return 'c_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Menghitung ulang field turunan: jarak dan pita radius. */
export function deriveCommunity(
  draft: CommunityDraft,
  id: string,
  updatedAt = new Date().toISOString(),
): Community {
  const distance_km = distanceFromBranchKm({ lat: draft.lat, lng: draft.lng })
  const radius_band = radiusBandOf(distance_km)
  return {
    ...draft,
    id,
    distance_km: Math.round(distance_km * 1000) / 1000,
    radius_band,
    updated_at: updatedAt,
  }
}

export function toDraft(c: Community): CommunityDraft {
  const { id, distance_km, radius_band, updated_at, ...rest } = c
  void id, distance_km, radius_band, updated_at
  return rest
}

/* -------------------------------------------------------------------------- */
/* Implementasi localStorage (default)                                         */
/* -------------------------------------------------------------------------- */

const KEY_COMMUNITIES = 'pim2:communities'
const KEY_ACTIVITIES = 'pim2:activities'
const KEY_SEED_VERSION = 'pim2:seed-version'

/**
 * Sidik jari isi seed (hash FNV-1a). Bila seed.ts diganti, sidik jarinya berubah
 * dan browser yang masih menyimpan data seed lama otomatis dimuat ulang.
 */
function seedFingerprint(): string {
  const text = JSON.stringify([seedCommunities(), SEED_ACTIVITIES])
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('Gagal menulis ke localStorage', err)
  }
}

class LocalRepo implements Repo {
  readonly kind = 'localStorage' as const

  /**
   * Mengisi seed bila penyimpanan kosong ATAU seed di kode sudah berganti.
   * Mode localStorage hanya untuk demo per browser, jadi data lokal lama
   * sengaja ditimpa agar semua browser melihat data terbaru.
   */
  async init(): Promise<void> {
    const empty = readJson<Community[]>(KEY_COMMUNITIES) === null
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(KEY_SEED_VERSION)
    } catch {
      stored = null
    }
    if (empty || stored !== seedFingerprint()) await this.resetToSeed()
  }

  async resetToSeed(): Promise<void> {
    const communities = seedCommunities().map((d) => deriveCommunity(d, newId()))
    const byName = new Map(communities.map((c) => [c.name, c.id]))
    const now = new Date().toISOString()
    const activities: Activity[] = SEED_ACTIVITIES.flatMap(({ community, ...rest }) => {
      const community_id = byName.get(community)
      if (!community_id) return []
      return [{ ...rest, community_id, id: newId(), created_at: now }]
    })
    writeJson(KEY_COMMUNITIES, communities)
    writeJson(KEY_ACTIVITIES, activities)
    try {
      window.localStorage.setItem(KEY_SEED_VERSION, seedFingerprint())
    } catch {
      // Tanpa penyimpanan, seed akan dimuat ulang pada kunjungan berikutnya.
    }
  }

  async listCommunities(): Promise<Community[]> {
    return readJson<Community[]>(KEY_COMMUNITIES) ?? []
  }

  async createCommunity(draft: CommunityDraft): Promise<Community> {
    const all = await this.listCommunities()
    const created = deriveCommunity(draft, newId())
    writeJson(KEY_COMMUNITIES, [...all, created])
    return created
  }

  async updateCommunity(id: string, patch: Partial<CommunityDraft>): Promise<Community> {
    const all = await this.listCommunities()
    const current = all.find((c) => c.id === id)
    if (!current) throw new Error('Komunitas tidak ditemukan: ' + id)
    const updated = deriveCommunity({ ...toDraft(current), ...patch }, id)
    writeJson(
      KEY_COMMUNITIES,
      all.map((c) => (c.id === id ? updated : c)),
    )
    return updated
  }

  async deleteCommunity(id: string): Promise<void> {
    const all = await this.listCommunities()
    writeJson(
      KEY_COMMUNITIES,
      all.filter((c) => c.id !== id),
    )
    const acts = await this.listActivities()
    writeJson(
      KEY_ACTIVITIES,
      acts.filter((a) => a.community_id !== id),
    )
  }

  async listActivities(): Promise<Activity[]> {
    return readJson<Activity[]>(KEY_ACTIVITIES) ?? []
  }

  async createActivity(draft: ActivityDraft): Promise<Activity> {
    const all = await this.listActivities()
    const created: Activity = { ...draft, id: newId(), created_at: new Date().toISOString() }
    writeJson(KEY_ACTIVITIES, [...all, created])
    return created
  }

  async deleteActivity(id: string): Promise<void> {
    const all = await this.listActivities()
    writeJson(
      KEY_ACTIVITIES,
      all.filter((a) => a.id !== id),
    )
  }
}

/* -------------------------------------------------------------------------- */
/* Implementasi Supabase (aktif bila URL + anon key tersedia di .env)          */
/* -------------------------------------------------------------------------- */

type PostgrestLike<T> = PromiseLike<{ data: T | null; error: { message: string } | null }>

class SupabaseRepo implements Repo {
  readonly kind = 'supabase' as const
  private client() {
    return getSupabase()
  }

  private async unwrap<T>(p: PostgrestLike<T>): Promise<T> {
    const { data, error } = await p
    if (error) throw new Error(error.message)
    return data as T
  }

  /**
   * Tidak ada seed otomatis: data bersama tim tidak boleh terisi ulang atau
   * terhapus dari klien. Data awal dimasukkan sekali lewat supabase/seed.sql.
   */
  async init(): Promise<void> {}

  async resetToSeed(): Promise<void> {
    throw new Error('Reset data dinonaktifkan pada Supabase. Gunakan supabase/seed.sql.')
  }

  async listCommunities(): Promise<Community[]> {
    const db = await this.client()
    const rows = await this.unwrap<Community[]>(
      db.from('communities').select('*').order('distance_km', { ascending: true }),
    )
    return (rows ?? []).map((r) => ({ ...r, product_opportunity: r.product_opportunity ?? [] }))
  }

  async createCommunity(draft: CommunityDraft): Promise<Community> {
    const db = await this.client()
    const row = deriveCommunity(draft, newId())
    const rows = await this.unwrap<Community[]>(db.from('communities').insert(row).select())
    return rows[0]
  }

  async updateCommunity(id: string, patch: Partial<CommunityDraft>): Promise<Community> {
    const db = await this.client()
    const found = await this.unwrap<Community[]>(
      db.from('communities').select('*').eq('id', id).limit(1),
    )
    if (!found.length) throw new Error('Komunitas tidak ditemukan: ' + id)
    const updated = deriveCommunity({ ...toDraft(found[0]), ...patch }, id)
    const rows = await this.unwrap<Community[]>(
      db.from('communities').update(updated).eq('id', id).select(),
    )
    return rows[0]
  }

  async deleteCommunity(id: string): Promise<void> {
    const db = await this.client()
    await this.unwrap(db.from('communities').delete().eq('id', id))
  }

  async listActivities(): Promise<Activity[]> {
    const db = await this.client()
    const rows = await this.unwrap<Activity[]>(
      db.from('activities').select('*').order('date', { ascending: false }),
    )
    return rows ?? []
  }

  async createActivity(draft: ActivityDraft): Promise<Activity> {
    const db = await this.client()
    const rows = await this.unwrap<Activity[]>(
      db.from('activities').insert({ ...draft, id: newId() }).select(),
    )
    return rows[0]
  }

  async deleteActivity(id: string): Promise<void> {
    const db = await this.client()
    await this.unwrap(db.from('activities').delete().eq('id', id))
  }
}

/** Backend dipilih sekali saat modul dimuat, berdasarkan variabel .env. */
export const repo: Repo = HAS_SUPABASE ? new SupabaseRepo() : new LocalRepo()
export const REPO_KIND = repo.kind
