import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/recipes': 'http://localhost:3000',
      '/tags': 'http://localhost:3000',
    },
  },
})
