import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.1.125', // or true for all interfaces
    port: 3000,
    strictPort: true // fail instead of auto-picking another port
  }
})
