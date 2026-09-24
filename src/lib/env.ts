/** Seluruh konfigurasi dibaca dari .env - tidak ada kunci yang di-hardcode. */

export type MapProvider = 'google' | 'leaflet'

const raw = import.meta.env

function str(v: string | undefined): string {
  return (v ?? '').trim()
}

/** Default leaflet supaya aplikasi jalan tanpa API key apa pun. */
export const MAP_PROVIDER: MapProvider =
  str(raw.VITE_MAP_PROVIDER).toLowerCase() === 'google' ? 'google' : 'leaflet'

export const GOOGLE_MAPS_API_KEY = str(raw.VITE_GOOGLE_MAPS_API_KEY)
/** DEMO_MAP_ID cukup untuk pengembangan; buat Map ID sendiri untuk produksi. */
export const GOOGLE_MAPS_MAP_ID = str(raw.VITE_GOOGLE_MAPS_MAP_ID) || 'DEMO_MAP_ID'

export const SUPABASE_URL = str(raw.VITE_SUPABASE_URL)
export const SUPABASE_ANON_KEY = str(raw.VITE_SUPABASE_ANON_KEY)
export const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/**
 * Akun tim bersama di Supabase Auth. Pengguna hanya mengetik password di halaman
 * masuk; email ini dipasangkan otomatis. Password TIDAK disimpan di kode.
 */
export const SUPABASE_LOGIN_EMAIL = str(raw.VITE_SUPABASE_LOGIN_EMAIL) || 'tim@pim2.local'
