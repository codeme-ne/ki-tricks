'use client'

import React, { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { KITrick } from '@/lib/types/types'
import { Badge } from '@/components/atoms/Badge'
import { categoryLabels, categoryEmojis } from '@/lib/constants/constants'

interface RefinedTrickCardProps {
  trick: KITrick
}

export const RefinedTrickCard: React.FC<RefinedTrickCardProps> = ({ trick }) => {
  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Memoize expensive calculations
  const categoryInfo = useMemo(() => ({
    label: categoryLabels[trick.category],
    emoji: categoryEmojis[trick.category]
  }), [trick.category])
  
  // Difficulty and impact labels removed
  
  // Memoize accent color calculation
  const accentColor = useMemo(() => ({
    productivity: '#3B82F6',
    'content-creation': '#A855F7',
    programming: '#22C55E',
    design: '#EC4899',
    'data-analysis': '#FB923C',
    learning: '#FACC15',
    business: '#6366F1',
    marketing: '#EF4444',
  }[trick.category] || '#2299DD'), [trick.category])

  // Memoize date calculation
  const isNew = useMemo(() => {
    if (!trick.createdAt) return false
    return (Date.now() - new Date(trick.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
  }, [trick.createdAt])

  return (
    <Link href={`/trick/${trick.slug}`} className="block h-full group">
      <div 
        className={`relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-full flex flex-col justify-between transition-all ${
          isMobile 
            ? 'duration-150' 
            : 'duration-300 hover:border-neutral-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1'
        }`}
        style={{ 
          contain: 'layout style paint',
          transform: 'translateZ(0)', // Enable hardware acceleration
          willChange: isMobile ? 'auto' : 'transform'
        }}
      >
        {!isMobile && (
          <div 
            className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(400px at 50% 0%, ${accentColor}10, transparent 80%)` }}
          />
        )}
        
        {/* Content */}
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* Difficulty badge removed */}
              {isNew && (
                <Badge variant="info">
                  Neu
                </Badge>
              )}
            </div>
            <ArrowRight className={`w-5 h-5 text-neutral-600 ${isMobile ? '' : 'group-hover:text-neutral-400 transition-colors duration-300'}`} />
          </div>

          {/* Title */}
          <h3 className={`text-xl font-semibold text-neutral-100 mb-3 ${isMobile ? '' : 'group-hover:text-white transition-colors duration-300'}`}>
            {trick.title}
          </h3>

          {/* Description */}
          <p className="text-neutral-400 line-clamp-3 mb-4 text-sm leading-relaxed">
            {trick.description.split('\n')[0]}
          </p>

          {/* Category Badge */}
          <div className="mb-4">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg text-sm border border-neutral-700"
              style={{ borderColor: `${accentColor}20` }}
            >
              <span>{categoryInfo.emoji}</span>
              <span>{categoryInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Footer */}
  <div className="pt-4 border-t border-neutral-800">
          
          {/* CTA Button */}
          <button className={`w-full py-2.5 px-4 bg-neutral-800 text-neutral-200 rounded-lg flex items-center justify-center gap-2 text-sm font-medium border border-neutral-700 ${
            isMobile 
              ? 'transition-colors duration-150 active:bg-neutral-700' 
              : 'hover:bg-neutral-700 hover:text-white transition-all duration-300 hover:border-neutral-600'
          }`}>
            Jetzt ausprobieren
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </Link>
  )
}

// Memoize component for performance
export default React.memo(RefinedTrickCard)