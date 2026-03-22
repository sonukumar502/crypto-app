import { useAuthStore } from '../store/useAuthStore'

export default function useWatchlist() {
  const { watchlist, addWatchlist, removeWatchlist } = useAuthStore()

  return {
    watchlist,
    add: addWatchlist,
    remove: removeWatchlist
  }
}
