import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/psx': {
        target: 'https://dps.psx.com.pk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/psx/, ''),
      },
      '/api/news': {
        target: 'https://api.gdeltproject.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, ''),
      },
    },
  },
})
