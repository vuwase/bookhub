import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Cache-busting for JS/CSS
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
  server: {
    // Ensure HMR works in development
    hmr: true,
  },
  resolve: {
    alias: {
      '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material/esm'),
      '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material/esm'),
      '@mui/system': path.resolve(__dirname, 'node_modules/@mui/system/esm')
    }
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/system'
    ]
  }
})