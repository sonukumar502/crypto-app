import React, { useEffect, useState, useContext } from 'react'
import useWatchlist from '../hooks/useWatchlist'
import useCoinGecko from '../hooks/useCoinGecko'
import { currency, pct } from '../utils/formatters'
import { CryptoContext } from '../context/CryptoContext'

export default function Watchlist({onOpenCoin}){
  const { watchlist, add, remove } = useWatchlist()
  const { getMarkets } = useCoinGecko()
  const { settings } = useContext(CryptoContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(watchlist.length===0){ setItems([]); return }
    let mounted = true
    setLoading(true)
    setItems([])
    getMarkets({ids: watchlist, per_page:watchlist.length, sparkline:false, vs_currency: settings.currency}).then(d => { if(mounted) { setItems(d); setLoading(false) } }).catch(()=>{ if(mounted) setLoading(false) })
    return () => { mounted = false }
  }, [watchlist.join(','), settings.currency])

  return (
    <div className="bg-slate-800 rounded p-4">
      <h2 className="text-lg font-semibold mb-3">Watchlist</h2>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {items.length===0 ? (
            <div className="text-slate-400 text-center py-4">{watchlist.length > 0 ? "CoinGecko API rate limit reached. Please wait 1-2 minutes." : "Your watchlist is empty. Add coins from Dashboard."}</div>
          ) : items.map(it => (
            <div key={it.id} className="flex items-center justify-between bg-slate-900 p-2 rounded">
              <div className="flex items-center gap-3 cursor-pointer" onClick={()=>onOpenCoin(it.id)}>
                <img src={it.image} className="w-8 h-8" alt="" />
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-slate-400">{it.symbol.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right">
                <div>{currency(it.current_price, settings.currency)}</div>
                <div className={`text-sm ${it.price_change_percentage_24h>0?'text-green-400':'text-red-400'}`}>{pct(it.price_change_percentage_24h)}</div>
              </div>
              <div>
                <button onClick={()=>remove(it.id)} className="px-2 py-1 bg-slate-700 rounded">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
