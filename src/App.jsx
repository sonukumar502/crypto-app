import React, { useContext, useState } from 'react'
import Dashboard from './components/Dashboard'
import Watchlist from './components/Watchlist'
import Portfolio from './components/Portfolio'
import CoinModal from './components/CoinModal'
import { CryptoContext } from './context/CryptoContext'

export default function App() {
  const { settings } = useContext(CryptoContext)
  const [view, setView] = useState('dashboard')
  const [selectedCoin, setSelectedCoin] = useState(null)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Crypto Tracker</h1>
        <nav className="space-x-2">
          <button onClick={() => setView('dashboard')} className={`px-3 py-1 rounded ${view==='dashboard'? 'bg-slate-800' : 'bg-transparent'}`}>Dashboard</button>
          <button onClick={() => setView('watchlist')} className={`px-3 py-1 rounded ${view==='watchlist'? 'bg-slate-800' : 'bg-transparent'}`}>Watchlist</button>
          <button onClick={() => setView('portfolio')} className={`px-3 py-1 rounded ${view==='portfolio'? 'bg-slate-800' : 'bg-transparent'}`}>Portfolio</button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto">
        {view === 'dashboard' && <Dashboard onOpenCoin={setSelectedCoin} />}
        {view === 'watchlist' && <Watchlist onOpenCoin={setSelectedCoin} />}
        {view === 'portfolio' && <Portfolio onOpenCoin={setSelectedCoin} />}
      </main>

      {selectedCoin && (
        <CoinModal id={selectedCoin} onClose={() => setSelectedCoin(null)} />
      )}

      <footer className="max-w-7xl mx-auto mt-8 text-xs text-slate-400">Data provided by CoinGecko • Client-side only • Built with React + Vite</footer>
    </div>
  )
}
