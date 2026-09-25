import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BRANCH } from '../lib/constants'
import { MAP_PROVIDER } from '../lib/env'
import { useData } from '../state/DataContext'
import { useAuth } from '../state/AuthGate'
import mandiriLogo from '../asset/mandiri-logo.webp'
import danantaraLogo from '../asset/LogoDanantara.png'
import pimLogo from '../asset/logo-emblem.png'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d={d}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: icon('M3 12h5v8H3zM9.5 4h5v16h-5zM16 9h5v11h-5z') },
  {
    to: '/peta',
    label: 'Peta Komunitas',
    icon: icon('M9 3 3 5.5v15L9 18l6 3 6-2.5v-15L15 6 9 3zm0 0v15m6-12v15'),
  },
  {
    to: '/database',
    label: 'Database',
    icon: icon('M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'),
  },
  {
    to: '/pipeline',
    label: 'Pipeline',
    icon: icon('M4 5h16M4 5v14M9 9h11M9 9v10M14 13h6M14 13v6'),
  },
  {
    to: '/aktivitas',
    label: 'Log Aktivitas',
    icon: icon('M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'),
  },
]

const PAGE_SUBTITLE: Record<string, string> = {
  '/': 'Ringkasan ekosistem komunitas dan pipeline NTB',
  '/peta': 'Sebaran komunitas dalam radius 1 - 5 km dari cabang',
  '/database': 'Data induk komunitas, diurutkan dari yang terdekat',
  '/pipeline': 'Papan akuisisi: geser kartu untuk memindahkan tahap',
  '/aktivitas': 'Riwayat kunjungan, kontak, dan onboarding',
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut } = useAuth()
  return (
    <nav className="flex h-full flex-col p-4">
      <div className="mb-6 flex items-center gap-3 border-b border-white/10 px-2 pb-5 pt-1">
        <img
          src={pimLogo}
          alt="Mandiri PIM 2"
          className="h-12 w-12 shrink-0"
          width={128}
          height={128}
        />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300">
            Community Mapping
          </p>
          <p className="mt-1.5 text-[15px] font-semibold leading-snug text-white">{BRANCH.name}</p>
        </div>
      </div>

      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-300">
        Menu
      </p>
      <div className="flex flex-col gap-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ' +
              (isActive
                ? 'bg-white/[0.08] text-white before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-gold'
                : 'text-navy-200 hover:bg-white/[0.04] hover:text-white')
            }
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto border-t border-white/10 px-2 pt-4 text-[11px] leading-relaxed text-navy-300">
        <p className="font-semibold text-navy-100">Internal Use Only - KCP Pondok Indah Mall 2</p>
        <dl className="mt-2 space-y-1.5">
          <div>
            <dt className="text-navy-200">Developed</dt>
            <dd>September 2026 · Continuously Updated via Database</dd>
          </div>
          <div>
            <dt className="text-navy-200">Source</dt>
            <dd>Field Observation &amp; Public Information</dd>
          </div>
        </dl>
        <p className="mt-2.5 text-gold-300">
          Prospect data requires validation before acquisition activity.
        </p>
        {signOut && (
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-navy-100 transition hover:bg-white/[0.06] hover:text-white"
          >
            {icon('M15 12H4m0 0 4-4m-4 4 4 4M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5')}
            Keluar
          </button>
        )}
        <p className="mt-3 border-t border-white/10 pt-3 text-[10px] text-navy-300/80">
          © 2026 KCP Pondok Indah Mall 2 — BranchX ODP 351
        </p>
      </div>
    </nav>
  )
}

function PartnerLogos() {
  return (
    <div className="flex shrink-0 items-center gap-3 sm:gap-5">
      <img
        src={mandiriLogo}
        alt="Bank Mandiri"
        className="h-5 w-auto sm:h-7"
        width={1280}
        height={374}
      />
      <span className="h-6 w-px bg-line sm:h-8" aria-hidden />
      <img
        src={danantaraLogo}
        alt="Danantara Indonesia"
        className="h-5 w-auto sm:h-7"
        width={871}
        height={229}
      />
    </div>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { backend, error } = useData()
  const active = NAV.find((n) => (n.to === '/' ? pathname === '/' : pathname.startsWith(n.to)))

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sidebar tetap pada layar lebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-navy-700 lg:block">
        <Sidebar />
      </aside>

      {/* Sidebar geser pada layar kecil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-900/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-navy-700 shadow-pop">
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-white">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-8 sm:py-4">
            <button
              type="button"
              className="rounded-lg border border-line p-1.5 text-navy-600 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buka navigasi"
            >
              {icon('M4 6h16M4 12h16M4 18h16')}
            </button>

            <div className="min-w-0 flex-1">
              <p className="hidden text-[11px] font-medium uppercase tracking-[0.12em] text-navy-400 sm:block">
                Bank Mandiri &middot; BranchX Project ODP 351
              </p>
              <p className="truncate text-base font-semibold leading-tight text-navy-800 sm:mt-0.5 sm:text-xl">
                {BRANCH.name}
              </p>
            </div>

            <PartnerLogos />
          </div>
          <div className="h-[3px] bg-gold" aria-hidden />

          {error && (
            <p className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-danger sm:px-8">
              Terjadi kesalahan: {error}
            </p>
          )}
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-navy-800">
                {active?.label ?? 'Dashboard'}
              </h1>
              <p className="mt-1 text-sm text-navy-400">{PAGE_SUBTITLE[active?.to ?? '/']}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs text-navy-400">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1" title="Sumber data">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                {backend === 'supabase' ? 'Supabase' : 'localStorage'}
              </span>
              <span className="rounded-md border border-line bg-white px-2 py-1" title="Penyedia peta">
                {MAP_PROVIDER === 'google' ? 'Google Maps' : 'OpenStreetMap'}
              </span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
