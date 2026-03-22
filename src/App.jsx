import React, { useContext, useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Watchlist from './components/Watchlist'
import Portfolio from './components/Portfolio'
import CoinModal from './components/CoinModal'
import { CryptoContext } from './context/CryptoContext'
import Auth from './components/Auth'
import { useAuthStore } from './store/useAuthStore'

export default function App() {
  const { settings } = useContext(CryptoContext)
  const [view, setView] = useState('dashboard')
  const [selectedCoin, setSelectedCoin] = useState(null)
  
  const { session, loading, initialize, signOut, user } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white bg-slate-900">Loading auth state...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center pt-16">
        <header className="max-w-7xl mx-auto mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Crypto Tracker</h1>
          <p className="text-slate-400 text-center mt-2">Log in to view your portfolio and watchlist</p>
        </header>
        <Auth />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Crypto Tracker</h1>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <nav className="space-x-2">
            <button onClick={() => setView('dashboard')} className={`px-3 py-1 rounded transition-colors ${view==='dashboard'? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>Dashboard</button>
            <button onClick={() => setView('watchlist')} className={`px-3 py-1 rounded transition-colors ${view==='watchlist'? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>Watchlist</button>
            <button onClick={() => setView('portfolio')} className={`px-3 py-1 rounded transition-colors ${view==='portfolio'? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>Portfolio</button>
          </nav>
          <div className="flex items-center space-x-3 border-l-2 border-slate-700 pl-4">
            <span className="text-sm font-medium text-blue-400 hidden sm:inline">@{user?.user_metadata?.username || 'user'}</span>
            <button onClick={signOut} className="text-sm px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors">Log Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {view === 'dashboard' && <Dashboard onOpenCoin={setSelectedCoin} />}
        {view === 'watchlist' && <Watchlist onOpenCoin={setSelectedCoin} />}
        {view === 'portfolio' && <Portfolio onOpenCoin={setSelectedCoin} />}
      </main>

      {selectedCoin && (
        <CoinModal id={selectedCoin} onClose={() => setSelectedCoin(null)} />
      )}

      <footer className="max-w-7xl mx-auto mt-12 text-xs text-slate-500 text-center border-t border-slate-800 pt-6">
        Data provided by CoinGecko • Secure login with Supabase
      </footer>
    </div>
  )
}
