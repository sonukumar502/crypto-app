import { useRef } from 'react'

const API = 'https://api.coingecko.com/api/v3'

// Simple caching layer: map key -> {ts, data}
const cache = new Map()
const TTL = 10 * 1000 // 10s

function cachedFetch(url){
  const now = Date.now()
  const entry = cache.get(url)
  if(entry && (now - entry.ts) < TTL) return Promise.resolve(entry.data)
  return fetch(url).then(res => {
    if(!res.ok) throw new Error('API error')
    return res.json()
  }).then(data => { cache.set(url, {ts: Date.now(), data}); return data })
}

export default function useCoinGecko(){
  const inFlight = useRef(new Map())

  async function getMarkets({vs_currency='usd', per_page=50, page=1, ids, order='market_cap_desc', sparkline=false}){
    const params = new URLSearchParams({vs_currency, order, per_page: String(per_page), page: String(page), sparkline: sparkline? 'true':'false'})
    if(ids) params.set('ids', ids.join(','))
    const url = `${API}/coins/markets?${params.toString()}`
    if(inFlight.current.has(url)) return inFlight.current.get(url)
    const p = cachedFetch(url).finally(() => inFlight.current.delete(url))
    inFlight.current.set(url, p)
    return p
  }

  async function simplePrice(ids, vs_currency='usd', include_24hr_change=true){
    if(!ids || ids.length===0) return {}
    const params = new URLSearchParams({ids: ids.join(','), vs_currencies: vs_currency, include_24hr_change: include_24hr_change? 'true':'false'})
    const url = `${API}/simple/price?${params.toString()}`
    return cachedFetch(url)
  }

  async function marketChart(id, vs_currency='usd', days=1){
    const url = `${API}/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}&interval=hourly`
    return cachedFetch(url)
  }

  return { getMarkets, simplePrice, marketChart }
}
