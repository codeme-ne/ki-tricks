'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, X, Sparkles } from 'lucide-react'
import { SearchBarProps } from '@/lib/types/types'
import { useDebounce } from '@/hooks/useDebounce'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onDebouncedChange,
  placeholder = 'Suche nach Tricks, Tools...',
  variant = 'default',
  debounceMs = 300
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  const particleIdRef = useRef(0)
  
  // Debounced search value
  const debouncedValue = useDebounce(value, debounceMs)
  
  // Call debounced callback when debounced value changes
  useEffect(() => {
    if (onDebouncedChange && debouncedValue !== value) {
      onDebouncedChange(debouncedValue)
    }
  }, [debouncedValue, onDebouncedChange, value])

  // Mobile Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleClear = () => {
    onChange?.('')
    if (variant === 'glowing') {
      inputRef.current?.focus()
    }
  }

  // Create particles when typing (glowing variant only, disabled on mobile)
  useEffect(() => {
    if (variant === 'glowing' && isTyping && isFocused && !isMobile && !shouldReduceMotion) {
      const interval = setInterval(() => {
        const rect = inputRef.current?.getBoundingClientRect()
        if (rect) {
          const newParticle: Particle = {
            id: particleIdRef.current++,
            x: rect.width - 50,
            y: rect.height / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2 - 1,
            life: 1,
          }
          setParticles(prev => [...prev, newParticle])
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [variant, isTyping, isFocused, isMobile, shouldReduceMotion])

  // Animate particles (glowing variant only, disabled on mobile)
  useEffect(() => {
    if (variant === 'glowing' && !isMobile && !shouldReduceMotion) {
      const interval = setInterval(() => {
        setParticles(prev => 
          prev
            .map(particle => ({
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + 0.1,
              life: particle.life - 0.02,
            }))
            .filter(particle => particle.life > 0)
        )
      }, 16)

      return () => clearInterval(interval)
    }
  }, [variant, isMobile, shouldReduceMotion])

  // Handle typing animation (glowing variant only)
  useEffect(() => {
    if (variant === 'glowing') {
      setIsTyping(true)
      const timeout = setTimeout(() => setIsTyping(false), 150)
      return () => clearTimeout(timeout)
    }
  }, [variant, value])

  // Vereinfachte Mobile Variante für glowing
  if (variant === 'glowing' && (isMobile || shouldReduceMotion)) {
    return (
      <div className="relative" role="search">
        <label htmlFor="search-input-mobile" className="sr-only">
          Suche nach KI-Tricks
        </label>
        <motion.div 
          className="relative group"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
        >
          {/* Einfacher Glow für Mobile */}
          {isFocused && (
            <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm" />
          )}
          
          <div className="relative bg-white rounded-lg border border-neutral-200 shadow-sm">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" 
              aria-hidden="true"
            />
            <input
              id="search-input-mobile"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-3 bg-transparent text-neutral-900 focus:outline-none placeholder-neutral-400"
              aria-describedby="search-help-mobile"
              autoComplete="off"
              spellCheck="false"
            />
            <div id="search-help-mobile" className="sr-only">
              Geben Sie Suchbegriffe ein, um KI-Tricks zu finden
            </div>
            
            {/* Suchergebnisse Live Region */}
            <div 
              aria-live="polite" 
              aria-atomic="false" 
              className="sr-only"
            >
              {value && `Suche nach "${value}"`}
            </div>
            
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
        </motion.div>
      </div>
    )
  }

  if (variant === 'glowing') {
    return (
      <div className="relative" role="search">
        <label htmlFor="search-input-glow" className="sr-only">
          Suche nach KI-Tricks
        </label>
        <motion.div 
          className="relative group"
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Multi-layer glow effect */}
          <AnimatePresence>
            {isFocused && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -inset-2 bg-primary-500 rounded-xl blur-xl"
                />
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur-md"
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -inset-[1px] rounded-lg"
                  style={{
                    background: 'linear-gradient(45deg, #2299dd, #60a5fa, #2299dd)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 3s ease infinite',
                  }}
                />
              </>
            )}
          </AnimatePresence>

          <div className="relative bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
            <div className="absolute inset-0 opacity-5">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #2299dd 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-primary-400 rounded-full"
                  initial={{ opacity: 1 }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    opacity: particle.life,
                  }}
                  transition={{ duration: 0 }}
                />
              ))}
            </div>

            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <motion.div
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  rotate: isFocused ? 15 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <Search className={`w-5 h-5 transition-colors duration-300 ${
                  isFocused ? 'text-primary-500' : 'text-neutral-400'
                }`} />
              </motion.div>
              
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.5, scale: 2 }}
                  className="absolute inset-0 bg-primary-400 rounded-full blur-xl"
                />
              )}
            </div>

            <input
              id="search-input-glow"
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="relative w-full pl-10 pr-10 py-3 bg-transparent text-neutral-900 focus:outline-none placeholder-neutral-400 transition-all duration-300 z-10"
              aria-describedby="search-help-glow"
              autoComplete="off"
              spellCheck="false"
              style={{
                textShadow: 'none',
              }}
            />
            <div id="search-help-glow" className="sr-only">
              Geben Sie Suchbegriffe ein, um KI-Tricks zu finden
            </div>
            
            {/* Suchergebnisse Live Region */}
            <div 
              aria-live="polite" 
              aria-atomic="false" 
              className="sr-only"
            >
              {value && `Suche nach "${value}"`}
            </div>

            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 
                           hover:text-neutral-600 transition-colors z-10"
                  aria-label="Suche löschen"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && value && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-12 top-1/2 -translate-y-1/2"
                >
                  <Sparkles className="w-4 h-4 text-primary-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {value && (
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary-400 to-primary-600"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((value.length / 50) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="relative" role="search">
      <label htmlFor="search-input" className="sr-only">
        Suche nach KI-Tricks
      </label>
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 z-10" 
        aria-hidden="true"
      />
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-all duration-200 hover:border-neutral-300 text-neutral-900 placeholder-neutral-400"
        aria-describedby="search-help"
        autoComplete="off"
        spellCheck="false"
      />
      <div id="search-help" className="sr-only">
        Geben Sie Suchbegriffe ein, um KI-Tricks zu finden
      </div>
      
      {/* Suchergebnisse Live Region */}
      <div 
        aria-live="polite" 
        aria-atomic="false" 
        className="sr-only"
      >
        {value && `Suche nach "${value}"`}
      </div>
      
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
  )
}