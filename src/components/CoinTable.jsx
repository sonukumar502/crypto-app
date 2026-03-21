import React, { useEffect, useMemo, useState } from 'react'
import useCoinGecko from '../hooks/useCoinGecko'
import { currency, pct } from '../utils/formatters'

export default function CoinTable({onOpenCoin, onToggleWatch}){
  const { getMarkets } = useCoinGecko()
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [sort, setSort] = useState({key: 'market_cap', dir: 'desc'})

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getMarkets({per_page:50}).then(data => { if(mounted){ setCoins(data); setLoading(false)} }).catch(()=> setLoading(false))
  const id = setInterval(() => getMarkets({per_page:50}).then(d => mounted && setCoins(d)), 10000)
    return ()=>{ mounted=false; clearInterval(id) }
  }, [])

  // Debounce search input by 300ms to reduce renders and API pressure
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 300)
    return () => clearTimeout(id)
  }, [q])

  const filtered = useMemo(() => {
    const term = debouncedQ.trim().toLowerCase()
    const list = coins.filter(c => !term || c.name.toLowerCase().includes(term) || c.symbol.toLowerCase().includes(term))
    const sorted = list.sort((a,b) => {
      const aV = a[sort.key] ?? 0
      const bV = b[sort.key] ?? 0
      return sort.dir === 'asc' ? aV - bV : bV - aV
    })
    return sorted
  }, [coins, debouncedQ, sort])

  return (
    <div className="bg-slate-800 rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="bg-slate-700 px-3 py-2 rounded w-60" />
        <div className="space-x-2">
          <button onClick={()=>setSort({key:'current_price', dir: sort.dir==='asc'?'desc':'asc'})} className="px-2 py-1 bg-slate-700 rounded">Sort Price</button>
          <button onClick={()=>setSort({key:'price_change_percentage_24h', dir: sort.dir==='asc'?'desc':'asc'})} className="px-2 py-1 bg-slate-700 rounded">Sort 24h</button>
          <button onClick={()=>setSort({key:'market_cap', dir: sort.dir==='asc'?'desc':'asc'})} className="px-2 py-1 bg-slate-700 rounded">Sort MCap</button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="p-2">#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h</th>
                <th>7d</th>
                <th>Mkt Cap</th>
                <th>Vol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-t border-slate-700 hover:bg-slate-900">
                  <td className="p-2">{c.market_cap_rank}</td>
                  <td className="p-2 cursor-pointer" onClick={()=>onOpenCoin(c.id)}>
                    <div className="flex items-center gap-2">
                      <img src={c.image} alt="" className="w-6 h-6 rounded" />
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">{currency(c.current_price)}</td>
                  <td className={`p-2 ${c.price_change_percentage_24h>0?'text-green-400':'text-red-400'}`}>{pct(c.price_change_percentage_24h)}</td>
                  <td className={`p-2 ${c.price_change_percentage_7d_in_currency>0?'text-green-400':'text-red-400'}`}>{c.price_change_percentage_7d_in_currency ? pct(c.price_change_percentage_7d_in_currency) : '-'}</td>
                  <td className="p-2">{currency(c.market_cap)}</td>
                  <td className="p-2">{currency(c.total_volume)}</td>
                  <td className="p-2">
                    <button onClick={() => onToggleWatch && onToggleWatch(c.id)} className="px-2 py-1 bg-slate-700 rounded">Watch</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
