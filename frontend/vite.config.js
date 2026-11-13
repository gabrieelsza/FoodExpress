import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Standalone Front-end (Zero backend/database dependency)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
