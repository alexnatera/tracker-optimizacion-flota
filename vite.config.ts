import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const REPO_NAME = '/tracker-optimizacion-flota/';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'],
      manifest: {
        name: 'OPTRACKER - Optimización y Control de Flota',
        short_name: 'OPTRACKER',
        description: 'Plataforma de gestión de flota, tareas y mejora continua Lean/Six Sigma DMAIC',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: REPO_NAME,
        scope: REPO_NAME,
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts']
  }

});
