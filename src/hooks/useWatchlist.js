import useLocalStorage from './useLocalStorage'

export default function useWatchlist(){
  const [watchlist, setWatchlist] = useLocalStorage('watchlist', [])

  function add(id){
    if(!id) return
    setWatchlist(prev => {
      if(prev.includes(id)) return prev
      return [...prev, id]
    })
  }

  function remove(id){
    setWatchlist(prev => prev.filter(x => x !== id))
  }

  return {watchlist, add, remove}
}
