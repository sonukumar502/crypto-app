import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CryptoProvider } from './context/CryptoContext'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <CryptoProvider>
      <App />
    </CryptoProvider>
  </React.StrictMode>
)

// Register service worker (optional; simple cache)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // register service worker relative to the app base (works on GitHub Pages)
    const swUrl = `${import.meta.env.BASE_URL}sw.js`
    navigator.serviceWorker.register(swUrl).catch(() => {})
  })
}
