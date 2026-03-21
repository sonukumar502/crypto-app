import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build into /docs for GitHub Pages
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',
    sourcemap: false
  }
})
