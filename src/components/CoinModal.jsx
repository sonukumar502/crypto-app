import React, { useEffect, useState, useContext } from 'react'
import useCoinGecko from '../hooks/useCoinGecko'
import { currency } from '../utils/formatters'
import { Line } from 'react-chartjs-2'
import { CryptoContext } from '../context/CryptoContext'

export default function CoinModal({id, onClose}){
  const { marketChart, getMarkets } = useCoinGecko()
  const [coin, setCoin] = useState(null)
  const [chartData, setChartData] = useState(null)
  const { settings } = useContext(CryptoContext)

  useEffect(() => {
    let mounted = true
    getMarkets({ids: [id], per_page:1, vs_currency: settings.currency}).then(res => { if(mounted) setCoin(res[0]) }).catch(()=>{})
    marketChart(id, settings.currency, 7).then(d => {
      if(!mounted) return
      const labels = d.prices.map(p => new Date(p[0]).toLocaleString())
      const data = d.prices.map(p => p[1])
      setChartData({labels, datasets:[{label: id, data, borderColor:'#60a5fa', backgroundColor:'rgba(96,165,250,0.2)'}]})
    }).catch(()=>{})
    return ()=> mounted=false
  }, [id, settings.currency])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-slate-900 rounded p-4 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{coin?.name ?? id}</h3>
          <button onClick={onClose} className="px-2 py-1 bg-slate-700 rounded">Close</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-slate-400">Price</div>
            <div className="text-xl">{currency(coin?.current_price, settings.currency)}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">Market Cap Rank</div>
            <div>{coin?.market_cap_rank ?? '-'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400">ATH</div>
            <div>{currency(coin?.ath, settings.currency)}</div>
          </div>
        </div>

        <div>
          {chartData ? <Line data={chartData} /> : <div className="text-slate-400">Loading chart...</div>}
        </div>

      </div>
    </div>
  )
}
