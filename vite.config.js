import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// base: './' makes the build use relative asset paths so it works when
// hosted at https://<user>.github.io/<repo-name>/ without extra config.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      // Permite testar o PWA já no "npm run dev", sem precisar publicar.
      devOptions: { enabled: true },
      manifest: {
        name: 'FlyLady App',
        short_name: 'FlyLady',
        description:
          'Organize a casa com o método FlyLady: zonas, rotinas diárias, hot spots, descarte e progresso.',
        theme_color: '#0d9488',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: './',
        scope: './',
        lang: 'pt-BR',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cacheia os arquivos da build e permite abrir o app offline
        // (os dados continuam vindo do Firebase quando há conexão).
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
