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
      '/api/psx-symbols': {
        target: 'https://dps.psx.com.pk',
        changeOrigin: true,
        rewrite: () => '/symbols',
      },
      '/api/psx-market-watch': {
        target: 'https://dps.psx.com.pk',
        changeOrigin: true,
        rewrite: () => '/market-watch',
      },
      '/api/psx-indices': {
        target: 'https://dps.psx.com.pk',
        changeOrigin: true,
        rewrite: () => '/indices/',
      },
      '/api/psx-top-10-symbols': {
        target: 'https://dps.psx.com.pk',
        changeOrigin: true,
        rewrite: () => '/data/top-10-symbols',
      },
      '/api/news': {
        target: 'https://api.gdeltproject.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, ''),
      },
      '/api/news-feed': {
        target: 'https://api.gdeltproject.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news-feed/, '/api/v2/doc/doc'),
      },
    },
  },
})
