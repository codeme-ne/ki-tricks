'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Sparkles } from 'lucide-react'
import { SearchBarProps } from '@/lib/types/types'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export const GlowingSearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  placeholder = 'Suche nach Tricks, Tools...'
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const particleIdRef = useRef(0)

  const handleClear = () => {
    onChange?.('')
    inputRef.current?.focus()
  }

  // Create particles when typing
  useEffect(() => {
    if (isTyping && isFocused) {
      const interval = setInterval(() => {
        const rect = inputRef.current?.getBoundingClientRect()
        if (rect) {
          const newParticle: Particle = {
            id: particleIdRef.current++,
            x: rect.width - 50, // Near the end of the input
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
  }, [isTyping, isFocused])

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            life: particle.life - 0.02,
          }))
          .filter(particle => particle.life > 0)
      )
    }, 16) // 60 FPS

    return () => clearInterval(interval)
  }, [])

  // Handle typing animation
  useEffect(() => {
    setIsTyping(true)
    const timeout = setTimeout(() => setIsTyping(false), 150)
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="relative">
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
              {/* Outer glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, scale: 1.1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-2 bg-primary-500 rounded-xl blur-xl"
              />
              
              {/* Inner glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur-md"
              />

              {/* Animated border */}
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

        {/* Search input container */}
        <div className="relative bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #2299dd 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          {/* Particle container */}
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

          {/* Icon with glow */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{
                scale: isFocused ? 1.1 : 1,
                rotate: isFocused ? 15 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Search className={`w-5 h-5 transition-colors duration-300 ${
                isFocused ? 'text-primary-400' : 'text-neutral-400'
              }`} />
            </motion.div>
            
            {/* Icon glow */}
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.5, scale: 2 }}
                className="absolute inset-0 bg-primary-400 rounded-full blur-xl"
              />
            )}
          </div>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="relative w-full pl-10 pr-10 py-3 bg-transparent text-white focus:outline-none placeholder-neutral-500 transition-all duration-300 z-10"
            style={{
              textShadow: isFocused ? '0 0 20px rgba(34, 153, 221, 0.5)' : 'none',
            }}
          />

          {/* Clear button */}
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
                         hover:text-white transition-colors z-10"
                aria-label="Suche löschen"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Typing indicator */}
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

          {/* Progress line */}
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