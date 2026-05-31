import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/logokitty/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'favicon.svg'],
      manifest: {
        name: 'Логокотик',
        short_name: 'Логокотик',
        description: 'Логопедическое приложение для детей 2–8 лет',
        theme_color: '#FF9E5E',
        background_color: '#FFF5EB',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [{
          urlPattern: /^https?:\/\/.*/,
          handler: 'NetworkFirst',
          options: { cacheName: 'api-cache', expiration: { maxEntries: 100, maxAgeSeconds: 86400 } },
        }],
      },
    }),
  ],
})
