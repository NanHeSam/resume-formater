import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['framer-motion', 'zustand', 'openai'],
          'vendor-pdf': ['html2pdf.js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
