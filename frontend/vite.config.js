import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ทำให้ Vite ฟังที่ IP ทุกตัว
    port: 5173,        // หรือพอร์ตที่คุณต้องการ
    proxy: {
      '/api': 'http://10.35.145.93:3000', // Vite proxy คำขอ API ไปที่ backend
    },
  },
})
