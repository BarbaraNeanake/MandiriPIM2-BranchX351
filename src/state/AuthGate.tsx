import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { HAS_SUPABASE, SUPABASE_LOGIN_EMAIL } from '../lib/env'
import { getSupabase } from '../lib/supabase'
import Login from '../pages/Login'

interface AuthState {
  /** null bila aplikasi berjalan tanpa Supabase (mode localStorage). */
  signOut: (() => Promise<void>) | null
}

const AuthContext = createContext<AuthState>({ signOut: null })

type Phase = 'checking' | 'signed_in' | 'signed_out'

/**
 * Gerbang password. Password diverifikasi oleh Supabase Auth terhadap akun tim
 * bersama, dan RLS hanya membuka tabel untuk sesi yang sudah masuk - jadi data
 * tetap terkunci meskipun halaman ini dilewati lewat DevTools.
 * Tanpa Supabase, data hanya ada di browser masing-masing sehingga gerbang dilewati.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(HAS_SUPABASE ? 'checking' : 'signed_in')

  useEffect(() => {
    if (!HAS_SUPABASE) return
    let alive = true
    let unsubscribe = () => {}
    getSupabase().then(async (db) => {
      const { data } = await db.auth.getSession()
      if (alive) setPhase(data.session ? 'signed_in' : 'signed_out')
      const sub = db.auth.onAuthStateChange((_event, session) => {
        if (alive) setPhase(session ? 'signed_in' : 'signed_out')
      })
      unsubscribe = () => sub.data.subscription.unsubscribe()
    })
    return () => {
      alive = false
      unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (password: string) => {
    const db = await getSupabase()
    const { error } = await db.auth.signInWithPassword({ email: SUPABASE_LOGIN_EMAIL, password })
    if (error) {
      throw new Error(
        error.status === 400 ? 'Password salah.' : 'Gagal masuk: ' + error.message,
      )
    }
  }, [])

  const signOut = useCallback(async () => {
    const db = await getSupabase()
    await db.auth.signOut()
  }, [])

  if (phase === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm text-navy-400">
        Memeriksa sesi...
      </div>
    )
  }
  if (phase === 'signed_out') return <Login onSubmit={signIn} />

  return (
    <AuthContext.Provider value={{ signOut: HAS_SUPABASE ? signOut : null }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  return useContext(AuthContext)
}
