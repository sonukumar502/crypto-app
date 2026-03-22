import React, { useEffect, useMemo, useState, useContext } from 'react'
import useCoinGecko from '../hooks/useCoinGecko'
import { currency } from '../utils/formatters'
import { Pie } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'
import { CryptoContext } from '../context/CryptoContext'

export default function Portfolio({onOpenCoin}){
  const { user } = useAuthStore()
  const [portfolio, setPortfolio] = useState([]) 
  const { simplePrice } = useCoinGecko()
  const [prices, setPrices] = useState({})
  const [form, setForm] = useState({id:'', quantity:'', buyPrice:''})
  const { settings } = useContext(CryptoContext)

  // 1. Load Portfolio from Supabase Cloud
  useEffect(() => {
    if (user) fetchPortfolio()
  }, [user])

  async function fetchPortfolio() {
    const { data } = await supabase.from('portfolios').select('*').eq('user_id', user.id)
    if (data) {
      setPortfolio(data.map(d => ({
        dbId: d.id,
        id: d.coin_id,
        quantity: d.quantity,
        buyPrice: d.buy_price
      })))
    }
  }

  // 2. Load live prices from CoinGecko
  useEffect(() => {
    const ids = portfolio.map(p=>p.id)
    if(ids.length===0) return setPrices({})
    let mounted = true
    setPrices({})
    simplePrice(ids, settings.currency, true).then(d => mounted && setPrices(d)).catch(()=>{})
    return () => { mounted = false }
  }, [portfolio.map(p=>p.id).join(','), settings.currency])

  const totalValue = useMemo(() => {
    return portfolio.reduce((s, p) => {
      const price = prices[p.id]?.[settings.currency] ?? 0
      return s + (p.quantity * price)
    }, 0)
  }, [portfolio, prices, settings.currency])

  const chartData = useMemo(() => {
    return {
      labels: portfolio.map(p=>p.id),
      datasets: [{ data: portfolio.map(p => (prices[p.id]?.[settings.currency] ?? 0) * p.quantity), backgroundColor: portfolio.map((_,i)=>[`#7c3aed`,`#06b6d4`,`#f97316`,`#ef4444`,`#10b981`][i%5]) }]
    }
  }, [portfolio, prices, settings.currency])

  async function addEntry(){
    if(!form.id || !form.quantity || !user) return
    const newEntry = {
      user_id: user.id,
      coin_id: form.id.toLowerCase(),
      quantity: Number(form.quantity),
      buy_price: Number(form.buyPrice||0)
    };
    
    // Save to database
    const { data, error } = await supabase.from('portfolios').insert(newEntry).select().single()
    if (data) {
      // Update UI 
      setPortfolio(prev => [...prev, { dbId: data.id, id: data.coin_id, quantity: data.quantity, buyPrice: data.buy_price }])
    }
    setForm({id:'',quantity:'',buyPrice:''})
  }

  async function removeEntry(dbId){ 
    // Optimistic UI delete
    setPortfolio(prev => prev.filter(p => p.dbId !== dbId)) 
    // Delete from db
    await supabase.from('portfolios').delete().eq('id', dbId).eq('user_id', user.id)
  }

  function exportCSV(){
    if(portfolio.length===0) return
    const headers = ['id','quantity','buyPrice','currentPrice','value']
    const rows = portfolio.map(p => {
      const current = prices[p.id]?.[settings.currency] ?? 0
      const value = current * p.quantity
      return [p.id, p.quantity, p.buyPrice, current, value]
    })
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolio.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-slate-800 rounded p-4">
        <h3 className="font-semibold mb-3">Portfolio</h3>
        <div className="mb-3 text-sm text-slate-400">Total Value: {currency(totalValue, settings.currency)}</div>
        <div className="space-y-2">
          {portfolio.length===0 ? <div className="text-slate-400">Add your first coin to the portfolio.</div> : Object.keys(prices).length === 0 ? <div className="text-slate-400 text-center py-4">CoinGecko API rate limit reached. Please wait 1-2 minutes.</div> : portfolio.map(p => {
            const current = prices[p.id]?.[settings.currency] ?? 0
            const value = current * p.quantity
            const profit = p.buyPrice ? ((current - p.buyPrice) / p.buyPrice) * 100 : 0
            return (
              <div key={p.dbId} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700">
                <div className="cursor-pointer" onClick={()=>onOpenCoin(p.id)}>{p.id}</div>
                <div className="text-right">
                  <div>{currency(value, settings.currency)}</div>
                  <div className={`text-sm ${profit>=0? 'text-green-400':'text-red-400'}`}>{profit ? profit.toFixed(2) + '%' : '-'}</div>
                </div>
                <div>
                  <button onClick={()=>removeEntry(p.dbId)} className="px-2 py-1 bg-red-600/20 text-red-500 rounded hover:bg-red-600/30 text-sm transition-colors">Del</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <aside className="bg-slate-800 rounded p-4 border border-slate-700">
        <h4 className="font-semibold mb-3">Add Coin</h4>
        <input placeholder="coin id (e.g. bitcoin)" value={form.id} onChange={e=>setForm({...form, id: e.target.value})} className="w-full mb-3 p-2 bg-slate-900 border border-slate-700 rounded text-white text-sm" />
        <input type="number" placeholder="quantity" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} className="w-full mb-3 p-2 bg-slate-900 border border-slate-700 rounded text-white text-sm" />
        <input type="number" placeholder="avg buy price (USD)" value={form.buyPrice} onChange={e=>setForm({...form, buyPrice: e.target.value})} className="w-full mb-3 p-2 bg-slate-900 border border-slate-700 rounded text-white text-sm" />
        <button onClick={addEntry} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition-colors text-white font-medium text-sm">Save to Cloud</button>
        <button onClick={exportCSV} className="w-full mt-2 bg-slate-700 hover:bg-slate-600 py-2 rounded transition-colors text-white text-sm">Export CSV</button>

        <div className="mt-8">
          <h5 className="font-semibold mb-4 text-center">Asset Allocation</h5>
          {portfolio.length === 0 ? <div className="text-slate-400 text-center">No data</div> : <div className="p-4"><Pie data={chartData} /></div>}
        </div>
      </aside>
    </div>
  )
}
