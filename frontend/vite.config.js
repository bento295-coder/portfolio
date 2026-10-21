import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seo from './scripts/seo-plugin.js'
import mediaSize from './scripts/media-size-plugin.js'

export default defineConfig({
  plugins: [mediaSize(), react(), seo()],
  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': `http://localhost:${process.env.API_PORT || 3001}`,
    },
  },
})
