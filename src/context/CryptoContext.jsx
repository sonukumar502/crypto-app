import React, { createContext, useState } from 'react'

export const CryptoContext = createContext()

const DEFAULT_SETTINGS = {
  currency: 'usd',
  theme: 'dark',
  refresh: 60
}

export function CryptoProvider({ children }){
  const [settings, setSettings] = useState(() => {
    try{
      const raw = localStorage.getItem('settings')
      return raw ? JSON.parse(raw) : DEFAULT_SETTINGS
    } catch { return DEFAULT_SETTINGS }
  })

  function updateSettings(patch){
    const next = {...settings, ...patch}
    setSettings(next)
    localStorage.setItem('settings', JSON.stringify(next))
  }

  return (
    <CryptoContext.Provider value={{settings, updateSettings}}>
      {children}
    </CryptoContext.Provider>
  )
}
