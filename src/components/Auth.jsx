import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    // UI Validation
    if (username.length < 6) {
      setError("Username must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
    }
    
    try {
      const { error: authError } = isLogin 
        ? await signIn(username, password)
        : await signUp(username, password, firstName, lastName);
        
      if (authError) {
        console.error("Supabase Auth Error:", authError); // <-- Added for debugging
        
        // Obfuscate standard invalid email error so user doesn't know we use fake emails
        if (authError.message.toLowerCase().includes("email")) {
            throw new Error(isLogin ? "Invalid username or password." : "Username format is invalid.");
        }
        if (authError.message.toLowerCase().includes("already registered") || authError.status === 422) {
             throw new Error("Username is already taken.");
        }
        throw authError; // Throw true error to UI (e.g., password too weak)
      }
      
      if (!isLogin) {
        setMessage('Success! You can now sign in.');
        setIsLogin(true); // Switch to login view
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
        <div>
          <h2 className="text-center text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Sign in to tracker' : 'Create an account'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm font-medium">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded text-sm font-medium">
              {message}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-3">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900 placeholder-slate-500 text-white rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900 placeholder-slate-500 text-white rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
              <input
                type="text"
                required
                minLength={6}
                className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900 placeholder-slate-500 text-white rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="6+ characters"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="appearance-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900 placeholder-slate-500 text-white rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="6+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setMessage(null);
              setUsername('');
              setPassword('');
              setFirstName('');
              setLastName('');
            }}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
