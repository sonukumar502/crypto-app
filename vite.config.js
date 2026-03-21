import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build into /docs for GitHub Pages
// If this app is served from a GitHub Pages repo at
// https://<user>.github.io/crypto-app/ set base to '/crypto-app/'
// so built asset paths are correct. Replace with your repo name
// or use './' for relative paths.
export default defineConfig({
  base: '/crypto-app/',
  plugins: [react()],
  build: {
    outDir: 'docs',
    sourcemap: false
  }
})
