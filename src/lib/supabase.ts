import type { SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './env'

let clientPromise: Promise<SupabaseClient> | null = null

/**
 * Satu klien Supabase untuk seluruh aplikasi, dipakai bersama oleh repo dan
 * gerbang login agar sesi yang sama ikut terkirim pada setiap query.
 * Impor dinamis agar bundel Supabase tidak dimuat saat memakai localStorage.
 *
 * Sesi disimpan di sessionStorage: bertahan saat halaman di-refresh, tetapi
 * hilang begitu tab/browser ditutup - setiap kali web dibuka lagi, password
 * diminta ulang.
 */
export function getSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storage: window.sessionStorage,
        },
      }),
    )
  }
  return clientPromise
}
