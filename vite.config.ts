import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Proxy local para o servidor de medição (npm run status:server). */
const measurementProxy = {
  '/api': {
    target: 'http://localhost:8787',
    changeOrigin: true,
  },
  // Caminho público da Provider Enrichment API da Ookla.
  '/v1': {
    target: 'http://localhost:8787',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: measurementProxy },
  preview: { proxy: measurementProxy },
})
