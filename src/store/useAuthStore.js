import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Supabase has strict email validation. We use a real-looking `.com` domain to trick the validation securely.
const getFakeEmail = (username) => {
  const safeString = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${safeString}@cryptotrackerapp.com`;
};

export const useAuthStore = create((set, get) => ({
  session: null,
  user: null,
  loading: true,
  watchlist: [],
  
  initialize: async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    const wl = session?.user?.user_metadata?.watchlist || [];
    set({ session, user: session?.user || null, loading: false, watchlist: wl });

    // Listen for changes
    supabase.auth.onAuthStateChange((_event, session) => {
      const wl = session?.user?.user_metadata?.watchlist || [];
      set({ session, user: session?.user || null, watchlist: wl });
    });
  },

  addWatchlist: async (id) => {
    const state = get();
    if(!id || !state.user || state.watchlist.includes(id)) return;
    const newList = [...state.watchlist, id];
    set({ watchlist: newList });
    await supabase.auth.updateUser({ data: { watchlist: newList } });
  },

  removeWatchlist: async (id) => {
    const state = get();
    if(!state.user) return;
    const newList = state.watchlist.filter(x => x !== id);
    set({ watchlist: newList });
    await supabase.auth.updateUser({ data: { watchlist: newList } });
  },

  signUp: async (username, password, firstName, lastName) => {
    const email = getFakeEmail(username);
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: username,
          first_name: firstName,
          last_name: lastName
        }
      }
    });
  },

  signIn: async (username, password) => {
    const email = getFakeEmail(username);
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  }
}));
