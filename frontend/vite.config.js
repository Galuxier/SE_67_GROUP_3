import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),

  ],
  server: {
    host: '0.0.0.0',
    port: 5173,      
    strictPort: true,
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:3000',
    },
  },
})
