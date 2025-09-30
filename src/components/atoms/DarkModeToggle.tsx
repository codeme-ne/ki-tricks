'use client'

import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '@/lib/context/DarkModeContext'

export function DarkModeToggle({ fullWidth = false }: { fullWidth?: boolean }) {
  const { theme, toggleTheme } = useDarkMode()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-muted transition-colors min-h-[44px] flex items-center justify-center gap-2 ${fullWidth ? 'w-full px-4 py-3' : 'min-w-[44px]'}`}
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-foreground" />
      ) : (
        <Sun className="w-5 h-5 text-foreground" />
      )}
      {fullWidth && (
        <span className="text-base font-medium">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  )
}