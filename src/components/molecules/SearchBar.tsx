'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { SearchBarProps } from '@/lib/types/types'

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  placeholder = 'Suche nach Tricks, Tools...'
}) => {
  const handleClear = () => {
    onChange?.('')
  }

  return (
    <div className="relative">
      <div className="relative group">
        {/* Animated glow effect - subtle version */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-0 group-hover:opacity-20 group-focus-within:opacity-30 transition duration-300"></div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="relative w-full pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300"
          />
          {value && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Suche löschen"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}