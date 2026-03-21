import React, { useContext } from 'react'
import CoinTable from './CoinTable'
import useWatchlist from '../hooks/useWatchlist'
import { CryptoContext } from '../context/CryptoContext'

export default function Dashboard({onOpenCoin}){
  const { add, watchlist } = useWatchlist()
  const { settings } = useContext(CryptoContext)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CoinTable onOpenCoin={onOpenCoin} onToggleWatch={(id)=>add(id)} />
      </div>
      <aside className="space-y-4">
        <div className="bg-slate-800 rounded p-4"> 
          <h3 className="font-semibold mb-2">Quick Stats</h3>
          <div className="text-sm text-slate-400">Currency: {settings.currency.toUpperCase()}</div>
          <div className="text-sm text-slate-400">Auto-refresh: {settings.refresh}s</div>
        </div>

        <div className="bg-slate-800 rounded p-4">
          <h3 className="font-semibold mb-2">Watchlist ({watchlist.length})</h3>
          {watchlist.length === 0 ? (
            <div className="text-slate-400">Add coins from the table to your watchlist.</div>
          ) : (
            <ul className="space-y-2 text-sm text-slate-200">{watchlist.map(w => <li key={w}>{w}</li>)}</ul>
          )}
        </div>
      </aside>
    </div>
  )
}
