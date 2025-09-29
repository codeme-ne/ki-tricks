'use client'

import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@/lib/context/DarkModeContext'

export function DarkModeToggle() {
  const { theme, toggleTheme } = useDarkMode()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-foreground" />
      ) : (
        <Sun className="w-5 h-5 text-foreground" />
      )}
    </button>
  )
}