'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface DarkModeContextType {
  theme: Theme
  toggleTheme: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme | null

      if (stored) {
        setTheme(stored)
        document.documentElement.classList.toggle('dark', stored === 'dark')
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initialTheme = prefersDark ? 'dark' : 'light'
        setTheme(initialTheme)
        document.documentElement.classList.toggle('dark', prefersDark)
      }
    } catch (error) {
      console.error('Error initializing dark mode:', error)
    }
  }, [])

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.error('Error toggling dark mode:', error)
    }
  }

  return (
    <DarkModeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}