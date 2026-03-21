import React, { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useCoinGecko from '../hooks/useCoinGecko'
import { currency } from '../utils/formatters'
import { Pie } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

export default function Portfolio({onOpenCoin}){
  const [portfolio, setPortfolio] = useLocalStorage('portfolio', [])
  const { simplePrice } = useCoinGecko()
  const [prices, setPrices] = useState({})
  const [form, setForm] = useState({id:'', quantity:'', buyPrice:''})

  useEffect(() => {
    const ids = portfolio.map(p=>p.id)
    if(ids.length===0) return setPrices({})
    simplePrice(ids, 'usd', true).then(setPrices).catch(()=>{})
  }, [portfolio.join(',' )])

  const totalValue = useMemo(() => {
    return portfolio.reduce((s, p) => {
      const price = prices[p.id]?.usd ?? 0
      return s + (p.quantity * price)
    }, 0)
  }, [portfolio, prices])

  const data = useMemo(() => {
    return {
      labels: portfolio.map(p=>p.id),
      datasets: [{ data: portfolio.map(p => (prices[p.id]?.usd ?? 0) * p.quantity), backgroundColor: portfolio.map((_,i)=>[`#7c3aed`,`#06b6d4`,`#f97316`,`#ef4444`,`#10b981`][i%5]) }]
    }
  }, [portfolio, prices])

  function addEntry(){
    if(!form.id || !form.quantity) return
    setPortfolio(prev => [...prev, {id: form.id, quantity: Number(form.quantity), buyPrice: Number(form.buyPrice||0)}])
    setForm({id:'',quantity:'',buyPrice:''})
  }

  function removeEntry(id){ setPortfolio(prev => prev.filter(p => p.id !== id)) }

  function exportCSV(){
    if(portfolio.length===0) return
    const headers = ['id','quantity','buyPrice','currentPrice','value']
    const rows = portfolio.map(p => {
      const current = prices[p.id]?.usd ?? 0
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
        <div className="mb-3 text-sm text-slate-400">Total Value: {currency(totalValue)}</div>
        <div className="space-y-2">
          {portfolio.length===0 ? <div className="text-slate-400">Add your first coin to the portfolio.</div> : portfolio.map(p => {
            const current = prices[p.id]?.usd ?? 0
            const value = current * p.quantity
            const profit = ((current - p.buyPrice) / p.buyPrice) * 100
            return (
              <div key={p.id} className="flex items-center justify-between p-2 bg-slate-900 rounded">
                <div className="cursor-pointer" onClick={()=>onOpenCoin(p.id)}>{p.id}</div>
                <div className="text-right">
                  <div>{currency(value)}</div>
                  <div className={`text-sm ${profit>=0? 'text-green-400':'text-red-400'}`}>{profit ? profit.toFixed(2) + '%' : '-'}</div>
                </div>
                <div>
                  <button onClick={()=>removeEntry(p.id)} className="px-2 py-1 bg-slate-700 rounded">Remove</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <aside className="bg-slate-800 rounded p-4">
        <h4 className="font-semibold mb-2">Add Coin</h4>
        <input placeholder="id (e.g. bitcoin)" value={form.id} onChange={e=>setForm({...form, id: e.target.value})} className="w-full mb-2 p-2 bg-slate-700 rounded" />
        <input placeholder="quantity" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} className="w-full mb-2 p-2 bg-slate-700 rounded" />
        <input placeholder="avg buy price (USD)" value={form.buyPrice} onChange={e=>setForm({...form, buyPrice: e.target.value})} className="w-full mb-2 p-2 bg-slate-700 rounded" />
        <button onClick={addEntry} className="w-full bg-indigo-600 py-2 rounded">Add</button>
  <button onClick={exportCSV} className="w-full mt-2 bg-slate-700 py-2 rounded">Export CSV</button>

        <div className="mt-4">
          <h5 className="font-semibold mb-2">Allocation</h5>
          {portfolio.length === 0 ? <div className="text-slate-400">No data</div> : <Pie data={data} />}
        </div>
      </aside>
    </div>
  )
}
