import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'

export default function useWatchlist() {
  const [watchlist, setWatchlist] = useState([])
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) return;
    fetchWatchlist();
  }, [user])

  async function fetchWatchlist() {
    const { data, error } = await supabase
      .from('watchlists')
      .select('coin_id')
      .eq('user_id', user.id)
    
    if (data) setWatchlist(data.map(d => d.coin_id))
  }

  async function add(id) {
    if(!id || !user || watchlist.includes(id)) return
    
    // Optimistic UI update for snappy feel
    setWatchlist(prev => [...prev, id])
    
    // Background cloud sync
    await supabase.from('watchlists').insert({
      user_id: user.id,
      coin_id: id
    })
  }

  async function remove(id) {
    if(!user) return
    setWatchlist(prev => prev.filter(x => x !== id))
    
    await supabase.from('watchlists')
      .delete()
      .match({ user_id: user.id, coin_id: id })
  }

  return { watchlist, add, remove }
}
