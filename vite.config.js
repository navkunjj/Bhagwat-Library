import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpeg'],
      manifest: {
        name: 'Bhagwat Library',
        short_name: 'BhagwatLib',
        description: 'Admin Portal for Bhagwat Library',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo.jpeg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'logo.jpeg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    allowedHosts: ['.ngrok-free.app'],
    // hmr: {
    //   clientPort: 443,
    //   protocol: 'wss'
    // }
  }
}
)
