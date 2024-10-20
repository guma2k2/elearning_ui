import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}
  }, server: {
    port: 5173,
    proxy: {
      '/ws': {
        target: 'http://localhost:8080',
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // Ensure the origin is correctly forwarded
      }
    }
  }
});