import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hosting seperti integrasi Supabase di Vercel membuat variabel tanpa awalan VITE_.
// Hanya nama yang aman untuk browser yang dipetakan satu per satu; jangan pernah
// menambah envPrefix 'SUPABASE_' karena SUPABASE_SERVICE_ROLE_KEY ikut ter-bundle.
const ENV_ALIASES: Record<string, string[]> = {
  VITE_SUPABASE_URL: ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'],
  VITE_SUPABASE_ANON_KEY: ['SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  VITE_SUPABASE_LOGIN_EMAIL: ['SUPABASE_LOGIN_EMAIL'],
}
for (const [target, sources] of Object.entries(ENV_ALIASES)) {
  if (process.env[target]) continue
  const found = sources.map((name) => process.env[name]).find(Boolean)
  if (found) process.env[target] = found
}

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
  // exceljs (~940 kB) sengaja dipisah dan baru dimuat saat tombol Export Excel diklik.
  build: { chunkSizeWarningLimit: 1000 },
})
