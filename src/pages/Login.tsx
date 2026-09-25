import { useState, type FormEvent } from 'react'
import { BRANCH } from '../lib/constants'
import mandiriLogo from '../asset/mandiri-logo.webp'
import danantaraLogo from '../asset/LogoDanantara.png'

export default function Login({ onSubmit }: { onSubmit: (password: string) => Promise<void> }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError(null)
    try {
      await onSubmit(password)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="h-[3px] bg-gold" aria-hidden />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-center gap-5">
            <img src={mandiriLogo} alt="Bank Mandiri" className="h-8 w-auto" width={1280} height={374} />
            <span className="h-9 w-px bg-line" aria-hidden />
            <img src={danantaraLogo} alt="Danantara Indonesia" className="h-8 w-auto" width={871} height={229} />
          </div>

          <div className="card p-6 sm:p-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-navy-400">
              Community Mapping
            </p>
            <h1 className="mt-1 text-xl font-semibold leading-snug text-navy-800">{BRANCH.name}</h1>
            <p className="mt-2 text-sm text-navy-400">
              Dashboard internal tim. Masukkan password untuk melanjutkan.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="input py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-danger" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary w-full py-2" disabled={busy || !password}>
                {busy ? 'Memeriksa...' : 'Masuk'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-navy-300">
            © 2026 KCP Pondok Indah Mall 2
          </p>
        </div>
      </main>
    </div>
  )
}
