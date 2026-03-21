export function currency(n, currency='usd'){
  if(n==null) return '-'
  return new Intl.NumberFormat('en-US', {style:'currency', currency: currency==='usd'?'USD':currency.toUpperCase(), maximumFractionDigits: 2}).format(n)
}

export function pct(n){
  if(n==null) return '-'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}
