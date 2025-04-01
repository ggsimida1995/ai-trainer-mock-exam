import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/ai-trainer-mock-exam/' : './',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    strictPort: true
  }
})