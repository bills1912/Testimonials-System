import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GANTI URL INI dengan URL backend Anda
const BACKEND_URL = 'https://testimonials-system.onrender.com'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path // keep /api prefix
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
