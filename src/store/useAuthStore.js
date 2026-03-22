import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Supabase has strict email validation. We use a real-looking `.com` domain to trick the validation securely.
const getFakeEmail = (username) => {
  const safeString = username.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${safeString}@cryptotrackerapp.com`;
};

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  loading: true,
  
  initialize: async () => {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, loading: false });

    // Listen for changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user || null });
    });
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
