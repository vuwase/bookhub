import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
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