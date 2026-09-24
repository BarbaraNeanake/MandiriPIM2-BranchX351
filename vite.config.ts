import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
  // exceljs (~940 kB) sengaja dipisah dan baru dimuat saat tombol Export Excel diklik.
  build: { chunkSizeWarningLimit: 1000 },
})
